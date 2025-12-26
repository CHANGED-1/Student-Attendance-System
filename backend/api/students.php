<?php
// ============================================
// FILE: backend/api/students.php
// ============================================
require_once '../config/database.php';
require_once '../models/Student.php';
require_once '../utils/Response.php';
require_once '../utils/Validator.php';

Response::setCorsHeaders();

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    Response::error('Database connection failed', 500);
}

$student = new Student($db);
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch($method) {
        case 'GET':
            if (isset($_GET['id'])) {
                // Get single student
                $result = $student->getById($_GET['id']);
                if ($result) {
                    Response::success('Student found', $result);
                } else {
                    Response::error('Student not found', 404);
                }
            } elseif (isset($_GET['search'])) {
                // Search students
                $results = $student->search($_GET['search']);
                Response::success('Search results', $results);
            } elseif (isset($_GET['class'])) {
                // Get students by class
                $results = $student->getByClass($_GET['class']);
                Response::success('Students retrieved', $results);
            } else {
                // Get all students
                $results = $student->getAll();
                Response::success('Students retrieved', $results);
            }
            break;

        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            
            // Validate input
            Validator::required($data['name'] ?? '', 'Name');
            Validator::required($data['rollNumber'] ?? '', 'Roll Number');
            Validator::required($data['class'] ?? '', 'Class');
            
            $id = $student->create(
                trim($data['name']), 
                trim($data['rollNumber']), 
                trim($data['class'])
            );
            
            Response::success('Student created successfully', ['id' => $id]);
            break;

        case 'PUT':
            $data = json_decode(file_get_contents('php://input'), true);
            
            // Validate input
            Validator::required($data['id'] ?? '', 'Student ID');
            Validator::required($data['name'] ?? '', 'Name');
            Validator::required($data['rollNumber'] ?? '', 'Roll Number');
            Validator::required($data['class'] ?? '', 'Class');
            
            // Check if student exists
            if (!$student->exists($data['id'])) {
                Response::error('Student not found', 404);
            }
            
            $student->update(
                $data['id'],
                trim($data['name']), 
                trim($data['rollNumber']), 
                trim($data['class'])
            );
            
            Response::success('Student updated successfully');
            break;

        case 'DELETE':
            $data = json_decode(file_get_contents('php://input'), true);
            
            Validator::required($data['id'] ?? '', 'Student ID');
            
            // Check if student exists
            if (!$student->exists($data['id'])) {
                Response::error('Student not found', 404);
            }
            
            $student->delete($data['id']);
            Response::success('Student deleted successfully');
            break;

        default:
            Response::error('Method not allowed', 405);
    }
} catch(Exception $e) {
    Response::error($e->getMessage(), 400);
}