<?php
// ============================================
// FILE: backend/utils/Validator.php
// ============================================
class Validator {
    public static function required($value, $fieldName) {
        if (empty($value)) {
            throw new Exception("$fieldName is required");
        }
        return true;
    }

    public static function email($value) {
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            throw new Exception("Invalid email format");
        }
        return true;
    }

    public static function minLength($value, $length, $fieldName) {
        if (strlen($value) < $length) {
            throw new Exception("$fieldName must be at least $length characters");
        }
        return true;
    }

    public static function maxLength($value, $length, $fieldName) {
        if (strlen($value) > $length) {
            throw new Exception("$fieldName must not exceed $length characters");
        }
        return true;
    }

    public static function validateDate($date) {
        $d = DateTime::createFromFormat('Y-m-d', $date);
        return $d && $d->format('Y-m-d') === $date;
    }
}