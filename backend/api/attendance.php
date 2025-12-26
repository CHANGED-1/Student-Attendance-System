<?php
// ============================================
// FILE: backend/api/attendance.php
// ============================================
require_once '../config/database.php';
require_once '../models/Attendance.php';
require_once '../models/Student.php';
require_once '../utils/Response.php';
require_once '../utils/Validator.php';

Response::setCorsHeaders();

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    Response::error('Database connection failed', 500);
}

$attendance = new Attendance($db);
$student = new Student($db);
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch($method) {
        case 'GET':
            if (isset($_GET['date'])) {
                // Get attendance by date
                if (!Validator::validateDate($_GET['date'])) {
                    Response::error('Invalid date format. Use YYYY-MM-DD');
                }
                $results = $attendance->getByDate($_GET['date']);
                Response::success('Attendance records retrieved', $results);
                
            } elseif (isset($_GET['student_id']) && isset($_GET['start_date']) && isset($_GET['end_date'])) {
                // Get attendance by student and date range
                if (!Validator::validateDate($_GET['start_date']) || !Validator::validateDate($_GET['end_date'])) {
                    Response::error('Invalid date format. Use YYYY-MM-DD');
                }
                
                $results = $attendance->getByStudentAndDateRange(
                    $_GET['student_id'],
                    $_GET['start_date'],
                    $_GET['end_date']
                );
                Response::success('Student attendance retrieved', $results);
                
            } elseif (isset($_GET['stats']) && isset($_GET['student_id'])) {
                // Get attendance statistics
                $startDate = $_GET['start_date'] ?? null;
                $endDate = $_GET['end_date'] ?? null;
                
                if ($startDate && !Validator::validateDate($startDate)) {
                    Response::error('Invalid start date format');
                }
                if ($endDate && !Validator::validateDate($endDate)) {
                    Response::error('Invalid end date format');
                }
                
                $stats = $attendance->getStatsByStudent($_GET['student_id'], $startDate, $endDate);
                Response::success('Statistics retrieved', $stats);
                
            } elseif (isset($_GET['class_stats']) && isset($_GET['class'])) {
                // Get class statistics
                $startDate = $_GET['start_date'] ?? null;
                $endDate = $_GET['end_date'] ?? null;
                
                $stats = $attendance->getStatsByClass($_GET['class'], $startDate, $endDate);
                Response::success('Class statistics retrieved', $stats);
                
            } else {
                Response::error('Invalid parameters. Required: date OR (student_id, start_date, end_date) OR (stats, student_id)');
            }
            break;

        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            
            // Validate input
            Validator::required($data['student_id'] ?? '', 'Student ID');
            Validator::required($data['date'] ?? '', 'Date');
            Validator::required($data['status'] ?? '', 'Status');
            
            if (!Validator::validateDate($data['date'])) {
                Response::error('Invalid date format. Use YYYY-MM-DD');
            }
            
            if (!in_array($data['status'], ['present', 'absent'])) {
                Response::error('Invalid status. Must be "present" or "absent"');
            }
            
            // Check if student exists
            if (!$student->exists($data['student_id'])) {
                Response::error('Student not found', 404);
            }
            
            $attendance->mark($data['student_id'], $data['date'], $data['status']);
            Response::success('Attendance marked successfully');
            break;

        default:
            Response::error('Method not allowed', 405);
    }
} catch(Exception $e) {
    Response::error($e->getMessage(), 400);
}