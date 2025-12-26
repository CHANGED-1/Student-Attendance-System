-- ============================================
-- Student Attendance Management System
-- Database Schema for PostgreSQL
-- ============================================

-- Drop existing tables if they exist (optional - for clean setup)
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS students CASCADE;

-- Create students table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    class VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create attendance table
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, date)
);

-- Create indexes for better query performance
CREATE INDEX idx_students_roll_number ON students(roll_number);
CREATE INDEX idx_students_class ON students(class);
CREATE INDEX idx_students_name ON students(name);
CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_status ON attendance(status);
CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to update updated_at on UPDATE
CREATE TRIGGER update_students_updated_at 
    BEFORE UPDATE ON students
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at 
    BEFORE UPDATE ON attendance
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample students (optional - for testing)
INSERT INTO students (name, roll_number, class) VALUES
('John Doe', 'CS101', 'Computer Science A'),
('Jane Smith', 'CS102', 'Computer Science A'),
('Michael Johnson', 'CS103', 'Computer Science A'),
('Emily Williams', 'CS104', 'Computer Science B'),
('David Brown', 'CS105', 'Computer Science B'),
('Sarah Davis', 'CS106', 'Computer Science B'),
('James Wilson', 'CS107', 'Computer Science C'),
('Emma Martinez', 'CS108', 'Computer Science C'),
('Daniel Anderson', 'CS109', 'Computer Science C'),
('Olivia Taylor', 'CS110', 'Computer Science A');

-- Insert sample attendance records for today (optional - for testing)
INSERT INTO attendance (student_id, date, status) VALUES
(1, CURRENT_DATE, 'present'),
(2, CURRENT_DATE, 'present'),
(3, CURRENT_DATE, 'absent'),
(4, CURRENT_DATE, 'present'),
(5, CURRENT_DATE, 'present'),
(6, CURRENT_DATE, 'absent'),
(7, CURRENT_DATE, 'present'),
(8, CURRENT_DATE, 'present'),
(9, CURRENT_DATE, 'present'),
(10, CURRENT_DATE, 'absent');

-- Insert sample attendance records for yesterday (optional - for testing)
INSERT INTO attendance (student_id, date, status) VALUES
(1, CURRENT_DATE - INTERVAL '1 day', 'present'),
(2, CURRENT_DATE - INTERVAL '1 day', 'absent'),
(3, CURRENT_DATE - INTERVAL '1 day', 'present'),
(4, CURRENT_DATE - INTERVAL '1 day', 'present'),
(5, CURRENT_DATE - INTERVAL '1 day', 'absent'),
(6, CURRENT_DATE - INTERVAL '1 day', 'present'),
(7, CURRENT_DATE - INTERVAL '1 day', 'present'),
(8, CURRENT_DATE - INTERVAL '1 day', 'absent'),
(9, CURRENT_DATE - INTERVAL '1 day', 'present'),
(10, CURRENT_DATE - INTERVAL '1 day', 'present');

-- Create views for common queries (optional)

-- View: Student attendance summary
CREATE OR REPLACE VIEW student_attendance_summary AS
SELECT 
    s.id,
    s.name,
    s.roll_number,
    s.class,
    COUNT(a.id) as total_days,
    SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present_days,
    SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absent_days,
    CASE 
        WHEN COUNT(a.id) > 0 THEN 
            ROUND((SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END)::numeric / COUNT(a.id)::numeric) * 100, 2)
        ELSE 0 
    END as attendance_percentage
FROM students s
LEFT JOIN attendance a ON s.id = a.student_id
GROUP BY s.id, s.name, s.roll_number, s.class
ORDER BY s.name;

-- View: Daily attendance report
CREATE OR REPLACE VIEW daily_attendance_report AS
SELECT 
    a.date,
    COUNT(DISTINCT a.student_id) as total_marked,
    SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present_count,
    SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absent_count,
    ROUND((SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END)::numeric / 
           COUNT(a.id)::numeric) * 100, 2) as attendance_percentage
FROM attendance a
GROUP BY a.date
ORDER BY a.date DESC;

-- View: Class-wise attendance summary
CREATE OR REPLACE VIEW class_attendance_summary AS
SELECT 
    s.class,
    COUNT(DISTINCT s.id) as total_students,
    COUNT(a.id) as total_records,
    SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present_count,
    SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absent_count,
    CASE 
        WHEN COUNT(a.id) > 0 THEN 
            ROUND((SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END)::numeric / 
                   COUNT(a.id)::numeric) * 100, 2)
        ELSE 0 
    END as attendance_percentage
FROM students s
LEFT JOIN attendance a ON s.id = a.student_id
GROUP BY s.class
ORDER BY s.class;

-- Stored procedure: Mark bulk attendance
CREATE OR REPLACE FUNCTION mark_bulk_attendance(
    p_date DATE,
    p_student_ids INTEGER[],
    p_status VARCHAR
)
RETURNS TABLE(success BOOLEAN, message TEXT) AS $$
DECLARE
    student_id INTEGER;
    affected_count INTEGER := 0;
BEGIN
    -- Validate status
    IF p_status NOT IN ('present', 'absent') THEN
        RETURN QUERY SELECT FALSE, 'Invalid status. Must be present or absent';
        RETURN;
    END IF;

    -- Loop through student IDs
    FOREACH student_id IN ARRAY p_student_ids
    LOOP
        -- Insert or update attendance
        INSERT INTO attendance (student_id, date, status)
        VALUES (student_id, p_date, p_status)
        ON CONFLICT (student_id, date) 
        DO UPDATE SET status = p_status, updated_at = CURRENT_TIMESTAMP;
        
        affected_count := affected_count + 1;
    END LOOP;

    RETURN QUERY SELECT TRUE, ('Marked ' || affected_count || ' students as ' || p_status)::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Function: Get attendance statistics for date range
CREATE OR REPLACE FUNCTION get_attendance_stats(
    p_start_date DATE,
    p_end_date DATE
)
RETURNS TABLE(
    date DATE,
    total_students BIGINT,
    present_count BIGINT,
    absent_count BIGINT,
    not_marked BIGINT,
    attendance_percentage NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.date,
        (SELECT COUNT(*) FROM students)::BIGINT as total_students,
        COUNT(CASE WHEN a.status = 'present' THEN 1 END)::BIGINT as present_count,
        COUNT(CASE WHEN a.status = 'absent' THEN 1 END)::BIGINT as absent_count,
        ((SELECT COUNT(*) FROM students) - COUNT(a.id))::BIGINT as not_marked,
        ROUND((COUNT(CASE WHEN a.status = 'present' THEN 1 END)::NUMERIC / 
               NULLIF(COUNT(a.id), 0)::NUMERIC) * 100, 2) as attendance_percentage
    FROM generate_series(p_start_date, p_end_date, '1 day'::interval) gs(date)
    LEFT JOIN attendance a ON a.date = gs.date
    GROUP BY a.date
    ORDER BY a.date;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO your_user;

-- Display success message
DO $$
BEGIN
    RAISE NOTICE '================================================';
    RAISE NOTICE 'Database schema created successfully!';
    RAISE NOTICE 'Tables: students, attendance';
    RAISE NOTICE 'Views: student_attendance_summary, daily_attendance_report, class_attendance_summary';
    RAISE NOTICE 'Functions: update_updated_at_column, mark_bulk_attendance, get_attendance_stats';
    RAISE NOTICE '================================================';
END $$;