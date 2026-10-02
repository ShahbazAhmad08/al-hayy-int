<?php
/**
 * Al Hayy International - Multi-Auth Synchronization Endpoint
 * Path: /v2/api/verify-auth.php
 * Native MySQLi Implementation matching Al Hayy Backend Architecture
 */

require_once 'db.php';

$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);

if (!$data) {
    echo json_encode(["success" => false, "status" => "error", "message" => "Invalid JSON payload received."]);
    exit();
}

$loginType = isset($data['login_type']) ? trim($data['login_type']) : 'phone';
$uid = isset($data['uid']) ? trim($data['uid']) : '';
$phone = isset($data['phone']) ? trim($data['phone']) : '';
$email = isset($data['email']) ? trim($data['email']) : '';
$name = isset($data['name']) ? trim($data['name']) : '';

if (empty($uid) && empty($phone) && empty($email)) {
    echo json_encode(["success" => false, "status" => "error", "message" => "Missing required authentication parameters."]);
    exit();
}

$safeUid = $conn->real_escape_string($uid);
$safePhone = $conn->real_escape_string(preg_replace('/[^\+0-9]/', '', $phone));
$safeEmail = $conn->real_escape_string(strtolower(trim($email)));
$safeName = $conn->real_escape_string(trim($name));
$safeProvider = $conn->real_escape_string($loginType);

$userId = null;
$userData = null;

if ($loginType === 'phone' || !empty($safePhone)) {
    // Check if user already exists by phone or firebase_uid
    $sql = "SELECT * FROM users WHERE (phone = '$safePhone' AND phone != '') OR (firebase_uid = '$safeUid' AND firebase_uid != '') LIMIT 1";
    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $userData = $result->fetch_assoc();
        $userId = $userData['id'];
        
        // Update firebase_uid if missing
        if (empty($userData['firebase_uid']) && !empty($safeUid)) {
            $conn->query("UPDATE users SET firebase_uid = '$safeUid' WHERE id = '$userId'");
        }
    } else {
        // Insert new patron user
        $displayName = !empty($safeName) ? $safeName : 'Patron ' . substr($safePhone, -4);
        $insertSql = "INSERT INTO users (username, phone, firebase_uid, role, auth_provider, created_at) 
                      VALUES ('$displayName', '$safePhone', '$safeUid', 'customer', '$safeProvider', NOW())";
        
        if ($conn->query($insertSql)) {
            $userId = $conn->insert_id;
            $userData = [
                'id' => $userId,
                'username' => $displayName,
                'phone' => $safePhone,
                'email' => '',
                'role' => 'customer',
                'auth_provider' => $safeProvider
            ];
        } else {
            echo json_encode(["success" => false, "status" => "error", "message" => "Failed to create user record: " . $conn->error]);
            exit();
        }
    }
} 
else if ($loginType === 'google' || !empty($safeEmail)) {
    // Check if user already exists by email or firebase_uid
    $sql = "SELECT * FROM users WHERE (email = '$safeEmail' AND email != '') OR (firebase_uid = '$safeUid' AND firebase_uid != '') LIMIT 1";
    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $userData = $result->fetch_assoc();
        $userId = $userData['id'];
        
        if (empty($userData['firebase_uid']) && !empty($safeUid)) {
            $conn->query("UPDATE users SET firebase_uid = '$safeUid' WHERE id = '$userId'");
        }
    } else {
        $displayName = !empty($safeName) ? $safeName : explode('@', $safeEmail)[0];
        $insertSql = "INSERT INTO users (username, email, firebase_uid, role, auth_provider, created_at) 
                      VALUES ('$displayName', '$safeEmail', '$safeUid', 'customer', '$safeProvider', NOW())";
        
        if ($conn->query($insertSql)) {
            $userId = $conn->insert_id;
            $userData = [
                'id' => $userId,
                'username' => $displayName,
                'email' => $safeEmail,
                'phone' => '',
                'role' => 'customer',
                'auth_provider' => $safeProvider
            ];
        } else {
            echo json_encode(["success" => false, "status" => "error", "message" => "Failed to create user record: " . $conn->error]);
            exit();
        }
    }
}

echo json_encode([
    "status" => "success",
    "success" => true,
    "message" => "User authenticated and synced successfully",
    "user_id" => $userId,
    "user" => [
        "id" => $userData['id'] ?? $userId,
        "username" => $userData['username'] ?? ($name ?: 'Patron'),
        "email" => $userData['email'] ?? $email,
        "phone" => $userData['phone'] ?? $phone,
        "role" => $userData['role'] ?? 'customer',
        "auth_provider" => $userData['auth_provider'] ?? $loginType
    ]
]);
?>
