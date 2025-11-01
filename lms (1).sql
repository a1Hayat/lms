-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 01, 2025 at 12:34 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lms`
--

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `level` enum('o-level','as-level','a-level','') NOT NULL,
  `description` text DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT 0.00,
  `instructor_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `title`, `level`, `description`, `thumbnail`, `price`, `instructor_id`, `created_at`) VALUES
(3, 'Demo', 'o-level', 'hshshshhshshsh shshshh', '/uploads/1761988387145-rtk5fa.png', 2499.00, NULL, '2025-11-01 09:13:07'),
(4, 'Demo3', 'o-level', 'hshshshhshshsh shshshh', '/uploads/1761988464457-leh935.png', 2499.00, NULL, '2025-11-01 09:14:24'),
(5, 'Demo3', 'o-level', 'hshshshhshshsh shshshh', '/uploads/1761988647855-Ideal_Gases_(8).png', 2499.00, 2, '2025-11-01 09:17:28'),
(6, 'Diddy Course', 'o-level', 'sdsssssssssssssss sssssssss', '/uploads/1761988814901-Ideal_Gases_(1).png', 3900.00, 2, '2025-11-01 09:20:15'),
(7, 'Diddy Course', 'o-level', 'sdsssssssssssssss sssssssss', '/uploads/1761988846912-Ideal_Gases_(1).png', 3900.00, 2, '2025-11-01 09:20:48');

-- --------------------------------------------------------

--
-- Table structure for table `course_resources`
--

CREATE TABLE `course_resources` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `resource_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `course_id` int(11) DEFAULT NULL,
  `resource_id` int(11) DEFAULT NULL,
  `enrolled_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('active','completed','dropped') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lessons`
--

CREATE TABLE `lessons` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `length` text DEFAULT NULL,
  `video_path` varchar(255) DEFAULT NULL,
  `order_index` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lessons`
--

INSERT INTO `lessons` (`id`, `course_id`, `title`, `length`, `video_path`, `order_index`, `created_at`) VALUES
(1, 3, 'Part-1', '', NULL, 1, '2025-11-01 09:13:07'),
(2, 3, 'Part-2', '', NULL, 2, '2025-11-01 09:13:07'),
(3, 5, 'Part-1', '20 min', NULL, 1, '2025-11-01 09:17:28'),
(4, 5, 'Part-2', '23 min', NULL, 2, '2025-11-01 09:17:28'),
(5, 7, 'Lec-1', '10 min', '/uploads/1761988847223-Relax,_your_solution_for_physics_is_just_around_the_corner_with_Sir_Cyrus._Stay_Tuned..mp4', 1, '2025-11-01 09:20:48'),
(6, 7, 'Lec-2', '40 min', '/uploads/1761988847313-Master_Physics_with_Cyrus,_a_5-month_journey_of_concepts,_clarity,_and_confidence_⚡Join_online_o.mp4', 2, '2025-11-01 09:20:48');

-- --------------------------------------------------------

--
-- Table structure for table `progress`
--

CREATE TABLE `progress` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `is_completed` tinyint(1) DEFAULT 0,
  `completed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `resources`
--

CREATE TABLE `resources` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `institution` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT '/images/users/user_default.png',
  `email_verified` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` enum('admin','student','cash') DEFAULT 'student'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `institution`, `image`, `email_verified`, `created_at`, `role`) VALUES
(2, 'Muhammad Umair Hayat', 'hayat6f2@gmail.com', '$2b$10$C8sBLXl8Edt4moZFDLREiugC3r06t.TxjPLd0EKZnb6e8c9caKrhq', '+923010492488', 'ISL Pine Avenue', '/images/users/user_default.png', NULL, '2025-10-16 12:16:04', 'admin'),
(5, 'Umair Student', 'student@cswithbari.com', '$2b$10$z.lDBoqLhfVpbsRX0Hza7uwfrd7KM3I8BsbzoIRjYssjbc0LW13HS', '+923010492488', 'ISL', '/images/users/user_default.png', NULL, '2025-10-17 15:45:40', 'student'),
(6, 'Vision Gulberg', 'gulberg@cswithbari.com', '$2b$10$HsR0VJNfoHgfuSwhwKbIXudo2HHZ9EHsxyLTvSzZBBOTkKC9CBhUa', '+923010492488', 'Vision JT', '/images/users/user_default.png', NULL, '2025-10-17 15:47:00', 'cash'),
(7, 'Muhammad Umair Hayat', 'umair@cswithbari.com', '$2b$10$UqFy4IJKRTD2W12rOCLgZebi1HXYkStMlgqEciYxETE.C1ghtK9n.', '+923010492488', 'ISL Pine Avenue', '/images/users/user_default.png', NULL, '2025-10-30 14:36:08', 'student'),
(8, 'Hussain Ali', 'hussain@cswithbari.com', '$2b$10$T7k48IbYwDXeVtkKIR5Wy.jDeWdjEZE5p7lnm2W0EGZ8gEjEAi21.', '+923008888888', NULL, '/images/users/user_default.png', NULL, '2025-10-30 15:08:24', 'admin'),
(9, 'Vision JT', 'jt@cswithbari.com', '$2b$10$d7iAlsi99nOm/w0Isws9iuzFUFFQcH6KQUSaDOhRspRcUxLksyQsu', '+923333333333', NULL, '/images/users/user_default.png', NULL, '2025-10-30 15:18:39', 'cash');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `instructor_id` (`instructor_id`);

--
-- Indexes for table `course_resources`
--
ALTER TABLE `course_resources`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `resource_id` (`resource_id`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `resource_id` (`resource_id`);

--
-- Indexes for table `lessons`
--
ALTER TABLE `lessons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `progress`
--
ALTER TABLE `progress`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `lesson_id` (`lesson_id`);

--
-- Indexes for table `resources`
--
ALTER TABLE `resources`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `course_resources`
--
ALTER TABLE `course_resources`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lessons`
--
ALTER TABLE `lessons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `progress`
--
ALTER TABLE `progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `resources`
--
ALTER TABLE `resources`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`instructor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `course_resources`
--
ALTER TABLE `course_resources`
  ADD CONSTRAINT `course_resources_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `course_resources_ibfk_2` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `enrollments_ibfk_3` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `lessons`
--
ALTER TABLE `lessons`
  ADD CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `progress`
--
ALTER TABLE `progress`
  ADD CONSTRAINT `progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `progress_ibfk_2` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
