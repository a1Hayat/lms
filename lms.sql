-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 13, 2025 at 08:56 PM
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
-- Table structure for table `bundles`
--

CREATE TABLE `bundles` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `discount_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bundles`
--

INSERT INTO `bundles` (`id`, `title`, `description`, `price`, `discount_price`, `created_at`) VALUES
(2, 'bundle-2', 'shshhshshshshshshsh', 6399.00, 2334.00, '2025-11-09 08:03:06'),
(3, 'Demo-1', 'Balalaalalal', 6399.00, 5999.00, '2025-11-09 08:13:22');

-- --------------------------------------------------------

--
-- Table structure for table `bundle_items`
--

CREATE TABLE `bundle_items` (
  `id` int(11) NOT NULL,
  `bundle_id` int(11) NOT NULL,
  `course_id` int(11) DEFAULT NULL,
  `resource_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bundle_items`
--

INSERT INTO `bundle_items` (`id`, `bundle_id`, `course_id`, `resource_id`) VALUES
(5, 2, 5, NULL),
(4, 2, 6, NULL),
(7, 3, 5, NULL),
(6, 3, 6, NULL);

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
(5, 'Demo3', 'o-level', 'hshshshhshshsh shshshh', '/uploads/1761988647855-Ideal_Gases_(8).png', 2499.00, 2, '2025-11-01 09:17:28'),
(6, 'Demo2', 'o-level', 'sdsssssssssssssss sssssssss', '/uploads/1761988814901-Ideal_Gases_(1).png', 3900.00, 2, '2025-11-01 09:20:15'),
(7, 'Demo1', 'o-level', 'sdsssssssssssssss sssssssss', '/uploads/1761988846912-Ideal_Gases_(1).png', 3900.00, 2, '2025-11-01 09:20:48'),
(8, 'O Level demo', 'o-level', 'ddddddddddddd', '/uploads/1763038143931-IQRA_UNI_REPRESENTATIVE.jpeg', 5999.00, 2, '2025-11-13 12:49:04'),
(9, 'A Level Demo', 'o-level', 'wwwwwwwwwww', '/uploads/1763038942079-IQRA_UNI_REPRESENTATIVE.jpeg', 2888.00, 2, '2025-11-13 13:02:23');

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

--
-- Dumping data for table `enrollments`
--

INSERT INTO `enrollments` (`id`, `user_id`, `course_id`, `resource_id`, `enrolled_at`, `status`) VALUES
(1, 5, 7, NULL, '2025-11-05 09:24:36', 'active'),
(4, 5, NULL, 4, '2025-11-09 13:16:59', 'active'),
(5, 5, NULL, 5, '2025-11-13 11:39:16', 'active'),
(6, 5, 9, NULL, '2025-11-13 13:04:00', 'active'),
(7, 5, 5, NULL, '2025-11-13 15:16:08', 'active'),
(8, 5, 6, NULL, '2025-11-13 15:16:08', 'active'),
(9, 10, NULL, 6, '2025-11-13 18:53:11', 'active'),
(10, 10, 7, NULL, '2025-11-13 18:54:15', 'active'),
(11, 10, NULL, 5, '2025-11-13 19:55:03', 'active');

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
(3, 5, 'Part-1', '20 min', NULL, 1, '2025-11-01 09:17:28'),
(4, 5, 'Part-2', '23 min', NULL, 2, '2025-11-01 09:17:28'),
(5, 7, 'Lec-1', '10 min', '/uploads/1761988847223-Relax,_your_solution_for_physics_is_just_around_the_corner_with_Sir_Cyrus._Stay_Tuned..mp4', 1, '2025-11-01 09:20:48'),
(6, 7, 'Lec-2', '40 min', '/uploads/1761988847313-Master_Physics_with_Cyrus,_a_5-month_journey_of_concepts,_clarity,_and_confidence_⚡Join_online_o.mp4', 2, '2025-11-01 09:20:48'),
(7, 8, 'Part-1', '12 min', '/uploads/1763038144206-Relax,_your_solution_for_physics_is_just_around_the_corner_with_Sir_Cyrus._Stay_Tuned..mp4', 1, '2025-11-13 12:49:04'),
(8, 9, 'Part-1', '10 min', '/secure_uploads/lessons/1763038942493-Relax,_your_solution_for_physics_is_just_around_the_corner_with_Sir_Cyrus._Stay_Tuned..mp4', 1, '2025-11-13 13:02:23');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount_amount` decimal(10,2) DEFAULT 0.00,
  `final_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `coupon_code` varchar(50) DEFAULT NULL,
  `processed_by` int(11) DEFAULT NULL,
  `payment_method` enum('card','bank','cash','paypal','stripe','free') DEFAULT 'card',
  `payment_status` enum('pending','paid','failed','refunded') DEFAULT 'pending',
  `transaction_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `discount_amount`, `final_amount`, `coupon_code`, `processed_by`, `payment_method`, `payment_status`, `transaction_id`, `created_at`) VALUES
(1, 5, 3900.00, 0.00, 3900.00, NULL, 9, 'cash', 'paid', NULL, '2025-11-05 09:02:13'),
(12, 5, 999.00, 0.00, 999.00, NULL, 9, 'cash', 'paid', NULL, '2025-11-09 13:09:00'),
(13, 5, 899.00, 0.00, 899.00, NULL, 9, 'cash', 'paid', NULL, '2025-11-13 11:38:42'),
(14, 5, 2888.00, 0.00, 2888.00, NULL, 9, 'cash', 'paid', NULL, '2025-11-13 13:03:25'),
(15, 5, 2334.00, 0.00, 2334.00, NULL, 9, 'cash', 'paid', NULL, '2025-11-13 15:12:16'),
(16, 10, 3900.00, 0.00, 3900.00, NULL, 9, 'cash', 'paid', NULL, '2025-11-13 18:52:12'),
(17, 10, 1111.00, 0.00, 1111.00, NULL, 9, 'cash', 'paid', NULL, '2025-11-13 18:52:39'),
(18, 10, 899.00, 0.00, 899.00, NULL, 9, 'cash', 'paid', NULL, '2025-11-13 19:54:38');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `course_id` int(11) DEFAULT NULL,
  `resource_id` int(11) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `bundle_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `course_id`, `resource_id`, `price`, `bundle_id`) VALUES
(1, 1, 7, NULL, 3900.00, NULL),
(5, 12, NULL, 4, 999.00, NULL),
(6, 13, NULL, 5, 899.00, NULL),
(7, 14, 9, NULL, 2888.00, NULL),
(8, 15, NULL, NULL, 2334.00, 2),
(9, 16, 7, NULL, 3900.00, NULL),
(10, 17, NULL, 6, 1111.00, NULL),
(11, 18, NULL, 5, 899.00, NULL);

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
  `level` enum('o-level','as-level','a-level','') NOT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resources`
--

INSERT INTO `resources` (`id`, `title`, `description`, `level`, `file_path`, `thumbnail`, `price`, `created_at`) VALUES
(4, 'A Level P2 Topical', 'ajajajaja jajaj', 'as-level', '/uploads/Web-App-Proposal%20(2).pdf', '/uploads/1762690921037_WhatsApp Image 2025-10-29 at 4.55.02 PM.jpeg', 999.00, '2025-11-09 12:22:01'),
(5, 'A Level P3 Topical', '1212', 'a-level', '/lms/secure_uploads/1763033789128_AL P3 Topical Haseeb Gilani.pdf', '/uploads/1763033789229_WhatsApp Image 2025-11-12 at 1.04.12 AM.jpeg', 899.00, '2025-11-13 11:36:29'),
(6, 'Demo', 'sssssss', 'a-level', '/lms/secure_uploads/1763059491459_ISL Event-Managment-System-Proposal (2).pdf', '/uploads/1763059491460_lock.png', 1111.00, '2025-11-13 18:44:51');

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
(5, 'Umair Hayat', 'student@cswithbari.com', '$2b$10$z.lDBoqLhfVpbsRX0Hza7uwfrd7KM3I8BsbzoIRjYssjbc0LW13HS', '+923010492488', 'ISL', '/images/users/user_default.png', NULL, '2025-10-17 15:45:40', 'student'),
(6, 'Vision Gulberg', 'gulberg@cswithbari.com', '$2b$10$HsR0VJNfoHgfuSwhwKbIXudo2HHZ9EHsxyLTvSzZBBOTkKC9CBhUa', '+923010492488', 'Vision JT', '/images/users/user_default.png', NULL, '2025-10-17 15:47:00', 'cash'),
(7, 'Muhammad Umair Hayat', 'umair@cswithbari.com', '$2b$10$UqFy4IJKRTD2W12rOCLgZebi1HXYkStMlgqEciYxETE.C1ghtK9n.', '+923010492488', 'ISL Pine Avenue', '/images/users/user_default.png', NULL, '2025-10-30 14:36:08', 'student'),
(8, 'Hussain Ali', 'hussain@cswithbari.com', '$2b$10$T7k48IbYwDXeVtkKIR5Wy.jDeWdjEZE5p7lnm2W0EGZ8gEjEAi21.', '+923008888888', NULL, '/images/users/user_default.png', NULL, '2025-10-30 15:08:24', 'admin'),
(9, 'Vision JT', 'jt@cswithbari.com', '$2b$10$d7iAlsi99nOm/w0Isws9iuzFUFFQcH6KQUSaDOhRspRcUxLksyQsu', '+923333333333', NULL, '/images/users/user_default.png', NULL, '2025-10-30 15:18:39', 'cash'),
(10, 'Hamza ', 'hamza@cswithbari.com', '$2b$10$D8k4Cf6gkm5JU5JGAaEN1OAMx6k6kyZK939puFtABDu4TorxfOwf.', '+923010492488', 'ISL Pine Avenue', '/images/users/user_default.png', NULL, '2025-11-13 18:47:13', 'student');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bundles`
--
ALTER TABLE `bundles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bundle_items`
--
ALTER TABLE `bundle_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `bundle_id` (`bundle_id`,`course_id`,`resource_id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `resource_id` (`resource_id`);

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
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `processed_by` (`processed_by`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `resource_id` (`resource_id`),
  ADD KEY `order_items_bundle_fk` (`bundle_id`);

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
-- AUTO_INCREMENT for table `bundles`
--
ALTER TABLE `bundles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `bundle_items`
--
ALTER TABLE `bundle_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `course_resources`
--
ALTER TABLE `course_resources`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `lessons`
--
ALTER TABLE `lessons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `progress`
--
ALTER TABLE `progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `resources`
--
ALTER TABLE `resources`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bundle_items`
--
ALTER TABLE `bundle_items`
  ADD CONSTRAINT `bundle_items_ibfk_1` FOREIGN KEY (`bundle_id`) REFERENCES `bundles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bundle_items_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `bundle_items_ibfk_3` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`) ON DELETE SET NULL;

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
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_processed_by_fk` FOREIGN KEY (`processed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_bundle_fk` FOREIGN KEY (`bundle_id`) REFERENCES `bundles` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `order_items_course_fk` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `order_items_order_fk` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_resource_fk` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`) ON DELETE SET NULL;

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
