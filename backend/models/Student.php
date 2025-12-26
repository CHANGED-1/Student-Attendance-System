<?php
// ============================================
// FILE: backend/models/Student.php
// ============================================
class Student {
    private $conn;
    private $table = 'students';

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getAll() {
        $query = "SELECT * FROM " . $this->table . " ORDER BY name ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getById($id) {
        $query = "SELECT * FROM " . $this->table . " WHERE id = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function getByClass($class) {
        $query = "SELECT * FROM " . $this->table . " WHERE class = ? ORDER BY name ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$class]);
        return $stmt->fetchAll();
    }

    public function create($name, $rollNumber, $class) {
        $query = "INSERT INTO " . $this->table . " (name, roll_number, class) VALUES (?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        
        try {
            $stmt->execute([$name, $rollNumber, $class]);
            return $this->conn->lastInsertId();
        } catch(PDOException $e) {
            if ($e->getCode() == 23505) { // Unique violation
                throw new Exception("Roll number already exists");
            }
            throw $e;
        }
    }

    public function update($id, $name, $rollNumber, $class) {
        $query = "UPDATE " . $this->table . " 
                  SET name = ?, roll_number = ?, class = ? 
                  WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        
        try {
            return $stmt->execute([$name, $rollNumber, $class, $id]);
        } catch(PDOException $e) {
            if ($e->getCode() == 23505) {
                throw new Exception("Roll number already exists");
            }
            throw $e;
        }
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->table . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$id]);
    }

    public function search($searchTerm) {
        $query = "SELECT * FROM " . $this->table . " 
                  WHERE name ILIKE ? OR roll_number ILIKE ? 
                  ORDER BY name ASC";
        $stmt = $this->conn->prepare($query);
        $searchTerm = "%{$searchTerm}%";
        $stmt->execute([$searchTerm, $searchTerm]);
        return $stmt->fetchAll();
    }

    public function exists($id) {
        $query = "SELECT COUNT(*) as count FROM " . $this->table . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        $result = $stmt->fetch();
        return $result['count'] > 0;
    }
}