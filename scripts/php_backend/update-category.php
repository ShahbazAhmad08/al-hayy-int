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

$id = 0;
$name = '';
$slug = '';
$image_url = '';

if (isset($_POST['id'])) {
    $id = intval($_POST['id']);
    $name = trim($_POST['name'] ?? '');
    $slug = trim($_POST['slug'] ?? '');
    $image_url = trim($_POST['image_url'] ?? '');
} else {
    $input = json_decode(file_get_contents('php://input'), true);
    if ($input) {
        $id = intval($input['id'] ?? 0);
        $name = trim($input['name'] ?? '');
        $slug = trim($input['slug'] ?? '');
        $image_url = trim($input['image_url'] ?? '');
    }
}

if ($id <= 0) {
    echo json_encode(["success" => false, "message" => "Valid Category ID is required"]);
    exit;
}

// Handle file upload if direct image file is attached
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = __DIR__ . '/uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
    $filename = md5(uniqid(rand(), true)) . '.' . ($ext ? $ext : 'jpg');
    $targetPath = $uploadDir . $filename;
    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
        $host = $_SERVER['HTTP_HOST'];
        $baseDir = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\');
        $image_url = "{$protocol}{$host}{$baseDir}/uploads/{$filename}";
    }
}

if (empty($name)) {
    echo json_encode(["success" => false, "message" => "Category name is required"]);
    exit;
}

if (empty($slug)) {
    $slug = strtolower(preg_replace('/[^A-Za-z0-9-]+/', '-', $name));
    $slug = trim($slug, '-');
}

$clean_name = $conn->real_escape_string($name);
$clean_slug = $conn->real_escape_string($slug);
$clean_image = $conn->real_escape_string($image_url);

// Ensure image_url column exists in categories table
$checkCol = $conn->query("SHOW COLUMNS FROM `categories` LIKE 'image_url'");
if ($checkCol && $checkCol->num_rows === 0) {
    $conn->query("ALTER TABLE `categories` ADD COLUMN `image_url` VARCHAR(500) NULL AFTER `slug`");
}

$sql = "UPDATE `categories` SET `name` = '$clean_name', `slug` = '$clean_slug'";
if (!empty($image_url)) {
    $sql .= ", `image_url` = '$clean_image'";
}
$sql .= " WHERE `id` = $id";

if ($conn->query($sql) === TRUE) {
    echo json_encode([
        "success" => true,
        "message" => "Category updated successfully",
        "data" => [
            "id" => $id,
            "name" => $name,
            "slug" => $slug,
            "image_url" => $image_url
        ]
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
}
?>
