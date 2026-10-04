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
if (isset($_POST['id'])) {
    $id = intval($_POST['id']);
} else {
    $input = json_decode(file_get_contents('php://input'), true);
    if ($input) {
        $id = intval($input['id'] ?? 0);
    }
}

if ($id <= 0) {
    echo json_encode(["success" => false, "message" => "Valid Category ID is required"]);
    exit;
}

$sql = "DELETE FROM `categories` WHERE `id` = $id";

if ($conn->query($sql) === TRUE) {
    echo json_encode([
        "success" => true,
        "message" => "Category deleted successfully",
        "id" => $id
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
}
?>
