<?php

require_once "config.php";

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false]);
    exit;
}

$name = trim($_POST["guest_name"] ?? "");
$message = trim($_POST["message"] ?? "");

if (strlen($name) < 2 || strlen($name) > 80) {
    http_response_code(422);
    echo json_encode([
        "success" => false,
        "message" => "Please enter a valid name."
    ]);
    exit;
}

if (mb_strlen($message) < 5 || mb_strlen($message) > 1000) {
    http_response_code(422);
    echo json_encode([
        "success" => false,
        "message" => "Please write a valid message."
    ]);
    exit;
}

try {

    $stmt = $pdo->prepare("
        INSERT INTO wedding_wishes (guest_name, message)
        VALUES (:name, :message)
    ");

    $stmt->execute([
        ":name" => $name,
        ":message" => $message
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Your wishes have been delivered with love!"
    ]);

} catch (PDOException $e) {

    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Something went wrong. Please try again."
    ]);
}