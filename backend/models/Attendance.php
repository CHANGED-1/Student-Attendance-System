<?php
// ============================================
// FILE: backend/models/Attendance.php
// ============================================
class Attendance {
    private $conn;
    private $table = 'attendance';

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getByDate($date) {
        $query = "SELECT a.*, s.name, s.roll_number, s.class 
                  FROM " . $this->table . " a 
                  JOIN students s ON a.student_id = s.id 
                  WHERE a.date = ? 
                  ORDER BY s.name ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$date]);
        return $stmt->fetchAll();
    }

    public function getByStudentAndDateRange($studentId, $startDate, $endDate) {
        $query = "SELECT a.*, s.name, s.roll_number, s.class 
                  FROM " . $this->table . " a 
                  JOIN students s ON a.student_id = s.id 
                  WHERE a.student_id = ? AND a.date BETWEEN ? AND ? 
                  ORDER BY a.date DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$studentId, $startDate, $endDate]);
        return $stmt->fetchAll();
    }

    public function mark($studentId, $date, $status) {
        // Check if attendance already exists
        $checkQuery = "SELECT id FROM " . $this->table . " 
                       WHERE student_id = ? AND date = ?";
        $checkStmt = $this->conn->prepare($checkQuery);
        $checkStmt->execute([$studentId, $date]);
        $existing = $checkStmt->fetch();

        if ($existing) {
            // Update existing record
            $query = "UPDATE " . $this->table . " 
                      SET status = ? 
                      WHERE student_id = ? AND date = ?";
            $stmt = $this->conn->prepare($query);
            return $stmt->execute([$status, $studentId, $date]);
        } else {
            // Insert new record
            $query = "INSERT INTO " . $this->table . " 
                      (student_id, date, status) VALUES (?, ?, ?)";
            $stmt = $this->conn->prepare($query);
            return $stmt->execute([$studentId, $date, $status]);
        }
    }

    public function getStatsByStudent($studentId, $startDate = null, $endDate = null) {
        $query = "SELECT 
                    COUNT(*) as total_days,
                    SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present_days,
                    SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent_days
                  FROM " . $this->table . " 
                  WHERE student_id = ?";
        
        $params = [$studentId];
        
        if ($startDate && $endDate) {
            $query .= " AND date BETWEEN ? AND ?";
            $params[] = $startDate;
            $params[] = $endDate;
        }
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);
        $result = $stmt->fetch();
        
        // Convert to integers
        return [
            'total_days' => (int)$result['total_days'],
            'present_days' => (int)$result['present_days'],
            'absent_days' => (int)$result['absent_days']
        ];
    }

    public function getStatsByClass($class, $startDate = null, $endDate = null) {
        $query = "SELECT 
                    s.class,
                    COUNT(DISTINCT s.id) as total_students,
                    COUNT(a.id) as total_records,
                    SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present_count,
                    SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absent_count
                  FROM students s
                  LEFT JOIN " . $this->table . " a ON s.id = a.student_id
                  WHERE s.class = ?";
        
        $params = [$class];
        
        if ($startDate && $endDate) {
            $query .= " AND a.date BETWEEN ? AND ?";
            $params[] = $startDate;
            $params[] = $endDate;
        }
        
        $query .= " GROUP BY s.class";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);
        return $stmt->fetch();
    }

    public function deleteByStudent($studentId) {
        $query = "DELETE FROM " . $this->table . " WHERE student_id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$studentId]);
    }
}