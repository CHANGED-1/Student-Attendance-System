<?php
// ============================================
// FILE: backend/api/reports.php
// ============================================
require_once '../config/database.php';
require_once '../models/Attendance.php';
require_once '../models/Student.php';
require_once '../utils/Response.php';

Response::setCorsHeaders();

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    Response::error('Database connection failed', 500);
}

$attendance = new Attendance($db);
$student = new Student($db);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        if (isset($_GET['summary'])) {
            // Get overall summary
            $query = "SELECT 
                        COUNT(DISTINCT s.id) as total_students,
                        COUNT(DISTINCT a.date) as total_days,
                        COUNT(a.id) as total_records,
                        SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as total_present,
                        SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as total_absent
                      FROM students s
                      LEFT JOIN attendance a ON s.id = a.student_id";
            
            $stmt = $db->prepare($query);
            $stmt->execute();
            $summary = $stmt->fetch();
            
            Response::success('Summary retrieved', $summary);
            
        } elseif (isset($_GET['class_breakdown'])) {
            // Get class-wise breakdown
            $query = "SELECT 
                        s.class,
                        COUNT(DISTINCT s.id) as student_count,
                        COUNT(a.id) as total_records,
                        SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present_count,
                        SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absent_count
                      FROM students s
                      LEFT JOIN attendance a ON s.id = a.student_id
                      GROUP BY s.class
                      ORDER BY s.class";
            
            $stmt = $db->prepare($query);
            $stmt->execute();
            $breakdown = $stmt->fetchAll();
            
            Response::success('Class breakdown retrieved', $breakdown);
            
        } else {
            Response::error('Invalid report type');
        }
    } catch(Exception $e) {
        Response::error($e->getMessage(), 500);
    }
} else {
    Response::error('Method not allowed', 405);
}