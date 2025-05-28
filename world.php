<?php

$host = 'localhost';
$username = 'root';  // default XAMPP username
$password = '';      // default XAMPP password
$dbname = 'world';

// Sanitize input
$country = isset($_GET['country']) ? $_GET['country'] : '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if (isset($_GET['all']) && $_GET['all'] === 'true') {
        $stmt = $conn->prepare("SELECT * FROM countries");
        $stmt->execute();
    } elseif ($country !== "") {
        $stmt = $conn->prepare("SELECT * FROM countries WHERE name LIKE :country");
        $stmt->execute(['country' => "%$country%"]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'No search criteria provided']);
        exit();
    }

$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (count($results) > 0) {
    echo '<div class="table-responsive">';
    echo '<table class="table table-hover">';
    echo '<thead class="table-light">';
    echo '<tr>';
    echo '<th>Country</th>';
    echo '<th>Continent</th>';
    echo '<th>Independence Year</th>';
    echo '<th>Head of State</th>';
    echo '</tr>';
    echo '</thead>';
    echo '<tbody>';
    
    foreach ($results as $row) {
        echo '<tr>';
        echo '<td>' . htmlspecialchars($row['name']) . '</td>';
        echo '<td>' . htmlspecialchars($row['continent']) . '</td>';
        echo '<td>' . ($row['independence_year'] ? htmlspecialchars($row['independence_year']) : 'N/A') . '</td>';
        echo '<td>' . htmlspecialchars($row['head_of_state']) . '</td>';
        echo '</tr>';
    }
    
    echo '</tbody>';
    echo '</table>';
    echo '</div>';
} else {
    echo '<div class="alert alert-info">No countries found matching your search criteria.</div>';
}