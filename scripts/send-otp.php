<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
require_once 'db.php';

// =========================================================================
// 📧 GMAIL SMTP CONFIGURATION (100% Free & Direct High-Speed Inbox Delivery)
// =========================================================================
$CONFIG_SMTP_HOST = "ssl://smtp.gmail.com";
$CONFIG_SMTP_PORT = 465;
$CONFIG_SMTP_USER = "shahbazzahmad4772@gmail.com";
$CONFIG_SMTP_PASS = getenv('SMTP_PASS') ?: "";
$CONFIG_RESEND_API_KEY = getenv('RESEND_API_KEY') ?: "";
// =========================================================================

$input = json_decode(file_get_contents('php://input'), true);
$email = filter_var($input['email'] ?? '', FILTER_VALIDATE_EMAIL);
$name  = htmlspecialchars($input['name'] ?? 'Customer');
$purpose = $input['purpose'] ?? 'register'; // 'register' | 'forgot_password' | 'login'

if (!$email) {
    echo json_encode(["success" => false, "message" => "Valid email address is required"]);
    exit;
}

$clean_email = $conn->real_escape_string($email);

// Auto-create email_otps table if not exists
$conn->query("CREATE TABLE IF NOT EXISTS email_otps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(10) NOT NULL,
    is_used TINYINT(1) DEFAULT 0,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

// Generate 6-digit numeric OTP
$otp = sprintf("%06d", mt_rand(100000, 999999));
$expires_at = date('Y-m-d H:i:s', strtotime('+10 minutes'));

$sql = "INSERT INTO email_otps (email, otp, expires_at) VALUES ('$clean_email', '$otp', '$expires_at')";

if ($conn->query($sql) === TRUE) {
    
    $isReset = ($purpose === 'forgot_password');
    $subject = $isReset ? "Password Reset Code: {$otp} — Al Hayy International" : "Verification Code: {$otp} — Al Hayy International";
    $heading = $isReset ? "Password Reset Request" : "Account Verification Code";
    $actionText = $isReset 
        ? "We received a request to reset your password. Use the verification code below to set a new password:" 
        : "Thank you for connecting with Al Hayy International. Please use the verification code below to sign in / complete verification:";

    // Luxury high-conversion HTML email template
    $htmlBody = "
    <!DOCTYPE html>
    <html>
    <head><meta charset='UTF-8'></head>
    <body style='margin:0;padding:0;background-color:#070E1E;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif;'>
        <table width='100%' border='0' cellspacing='0' cellpadding='0' style='background-color:#070E1E;padding:40px 15px;'>
            <tr>
                <td align='center'>
                    <table width='100%' border='0' cellspacing='0' cellpadding='0' style='max-width:500px;background-color:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.3);'>
                        <tr>
                            <td style='background-color:#022C22;padding:32px 30px;text-align:center;border-bottom:2px solid #D4AF37;'>
                                <h1 style='margin:0;color:#F7E7B6;font-size:22px;letter-spacing:2px;font-weight:800;text-transform:uppercase;'>AL HAYY INTERNATIONAL</h1>
                                <p style='margin:6px 0 0;color:#a7f3d0;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;'>Authentic Kashmiri Heritage & Luxury Handcrafts</p>
                            </td>
                        </tr>
                        <tr>
                            <td style='padding:36px 32px;'>
                                <h2 style='margin:0 0 12px;color:#070E1E;font-size:18px;font-weight:700;'>{$heading}</h2>
                                <p style='margin:0 0 16px;color:#475569;font-size:14px;line-height:1.6;'>Hello <strong>{$name}</strong>,</p>
                                <p style='margin:0 0 20px;color:#475569;font-size:14px;line-height:1.6;'>{$actionText}</p>
                                
                                <div style='background-color:#FDFBF7;border:2px dashed #D4AF37;border-radius:16px;padding:22px;text-align:center;margin:24px 0;'>
                                    <span style='font-size:34px;font-weight:800;letter-spacing:10px;color:#022C22;font-family:monospace;display:inline-block;'>{$otp}</span>
                                </div>
                                
                                <p style='margin:0 0 8px;color:#64748b;font-size:12px;'>⏱️ This verification code is valid for <strong>10 minutes</strong>.</p>
                                <p style='margin:0;color:#94a3b8;font-size:12px;'>If you did not request this code, please safely disregard this email.</p>
                            </td>
                        </tr>
                        <tr>
                            <td style='background-color:#f8fafc;padding:20px 30px;text-align:center;border-top:1px solid #e2e8f0;'>
                                <p style='margin:0;color:#94a3b8;font-size:11px;'>© " . date('Y') . " Al Hayy International. All rights reserved.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    ";

    $delivered = false;
    $deliveryMethod = "none";
    $smtp_log = "";

    // 1. Authenticated Gmail SSL SMTP (Primary - 100% Reliable & Direct)
    if (!empty($CONFIG_SMTP_USER) && !empty($CONFIG_SMTP_PASS)) {
        $host = $CONFIG_SMTP_HOST; // "ssl://smtp.gmail.com"
        $port = $CONFIG_SMTP_PORT; // 465
        $user = $CONFIG_SMTP_USER;
        $pass = $CONFIG_SMTP_PASS;

        $socket = @fsockopen($host, $port, $errno, $errstr, 12);
        if ($socket) {
            $smtp_log .= fgets($socket, 512);
            fputs($socket, "EHLO localhost\r\n");
            $smtp_log .= fgets($socket, 512);
            fputs($socket, "AUTH LOGIN\r\n");
            $smtp_log .= fgets($socket, 512);
            fputs($socket, base64_encode($user) . "\r\n");
            $smtp_log .= fgets($socket, 512);
            fputs($socket, base64_encode($pass) . "\r\n");
            $auth_res = fgets($socket, 512);
            $smtp_log .= $auth_res;

            if (strpos($auth_res, '235') !== false) {
                fputs($socket, "MAIL FROM: <{$user}>\r\n");
                $smtp_log .= fgets($socket, 512);
                fputs($socket, "RCPT TO: <{$email}>\r\n");
                $smtp_log .= fgets($socket, 512);
                fputs($socket, "DATA\r\n");
                $smtp_log .= fgets($socket, 512);

                $headers  = "From: Al Hayy International <{$user}>\r\n";
                $headers .= "Reply-To: {$user}\r\n";
                $headers .= "To: {$email}\r\n";
                $headers .= "Subject: {$subject}\r\n";
                $headers .= "MIME-Version: 1.0\r\n";
                $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

                fputs($socket, $headers . "\r\n" . $htmlBody . "\r\n.\r\n");
                $send_res = fgets($socket, 512);
                $smtp_log .= $send_res;
                fputs($socket, "QUIT\r\n");
                fclose($socket);

                if (strpos($send_res, '250') !== false) {
                    $delivered = true;
                    $deliveryMethod = "Gmail SMTP (SSL 465)";
                }
            } else {
                fclose($socket);
            }
        }
    }

    // 2. Resend API Fallback
    if (!$delivered) {
        $resendKey = $CONFIG_RESEND_API_KEY;
        if ($resendKey && strpos($resendKey, 're_') === 0) {
            $ch = curl_init('https://api.resend.com/emails');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Authorization: Bearer ' . $resendKey,
                'Content-Type: application/json'
            ]);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
                'from' => 'Al Hayy International <onboarding@resend.dev>',
                'to' => [$email],
                'subject' => $subject,
                'html' => $htmlBody
            ]));
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode === 200 || $httpCode === 201) {
                $delivered = true;
                $deliveryMethod = "Resend API (HTTPS)";
            }
        }
    }

    // 3. Native PHP mail() Fallback
    if (!$delivered) {
        $headers  = "From: Al Hayy International <info@alhayyinternational.com>\r\n";
        $headers .= "Reply-To: info@alhayyinternational.com\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $mailSent = @mail($email, $subject, $htmlBody, $headers, "-finfo@alhayyinternational.com");
        if ($mailSent) {
            $delivered = true;
            $deliveryMethod = "PHP mail() fallback";
        }
    }

    echo json_encode([
        "success" => true,
        "message" => "Verification code sent successfully to " . $email,
        "delivered" => $delivered,
        "delivery_method" => $deliveryMethod
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
}
?>
