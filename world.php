<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

try {
    $host = 'localhost';
    $username = 'root';
    $password = '';
    $dbname = 'world';
    
    // Sanitize input
    $country = isset($_GET['country']) ? trim($_GET['country']) : '';
    
    $conn = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8",
        $username,
        $password,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    
    if (isset($_GET['all']) && $_GET['all'] === 'true') {
        $stmt = $conn->prepare("SELECT * FROM countries ORDER BY name");
        $stmt->execute();
    } elseif ($country !== "") {
        $stmt = $conn->prepare("SELECT * FROM countries WHERE name LIKE :country ORDER BY name");
        $stmt->execute(['country' => "%$country%"]);
    } else {
        throw new Exception('No search criteria provided');
    }
    
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($results)) {
        echo json_encode([
            'status' => 'success',
            'message' => 'No countries found',
            'data' => []
        ]);
        exit;
    }
    
    // Format the output as a table
    $output = '<div class="table-responsive"><table class="table table-hover">
        <thead class="table-light">
            <tr>
                <th>Country</th>
                <th>Continent</th>
                <th>Independence Year</th>
                <th>Head of State</th>
            </tr>
        </thead>
        <tbody>';
    
    foreach ($results as $row) {
        $output .= sprintf(
            '<tr>
                <td>%s</td>
                <td>%s</td>
                <td>%s</td>
                <td>%s</td>
            </tr>',
            htmlspecialchars($row['name']),
            htmlspecialchars($row['continent']),
            $row['independence_year'] ? htmlspecialchars($row['independence_year']) : 'N/A',
            htmlspecialchars($row['head_of_state'])
        );
    }
    
    $output .= '</tbody></table></div>';
    echo $output;
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}