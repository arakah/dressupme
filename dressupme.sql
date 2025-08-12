-- phpMyAdmin SQL Dump
-- version 4.4.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jul 21, 2025 at 10:05 AM
-- Server version: 5.6.26
-- PHP Version: 5.6.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dressupme`
--

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE IF NOT EXISTS `items` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `category` enum('top','bottom','shoes') NOT NULL,
  `image_url` text NOT NULL,
  `cloudinary_public_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`id`, `user_id`, `category`, `image_url`, `cloudinary_public_id`, `created_at`) VALUES
(13, 4, 'top', 'https://res.cloudinary.com/dvnx2ghdw/image/upload/v1753067991/mixmatch_items/j2fiqglvnhybufl9cuid.jpg', 'mixmatch_items/j2fiqglvnhybufl9cuid', '2025-07-21 03:19:54'),
(14, 4, 'bottom', 'https://res.cloudinary.com/dvnx2ghdw/image/upload/v1753068003/mixmatch_items/q2nkf1sppr31nju2phm7.jpg', 'mixmatch_items/q2nkf1sppr31nju2phm7', '2025-07-21 03:20:07'),
(15, 4, 'shoes', 'https://res.cloudinary.com/dvnx2ghdw/image/upload/v1753068015/mixmatch_items/dqf45akxx85u7xnaeyxx.jpg', 'mixmatch_items/dqf45akxx85u7xnaeyxx', '2025-07-21 03:20:21'),
(16, 4, 'top', 'https://res.cloudinary.com/dvnx2ghdw/image/upload/v1753068029/mixmatch_items/tyjwrse3sznbwphogtgg.jpg', 'mixmatch_items/tyjwrse3sznbwphogtgg', '2025-07-21 03:20:47'),
(17, 4, 'bottom', 'https://res.cloudinary.com/dvnx2ghdw/image/upload/v1753068055/mixmatch_items/wrnsqek0xgah2owoflev.jpg', 'mixmatch_items/wrnsqek0xgah2owoflev', '2025-07-21 03:21:00'),
(18, 4, 'shoes', 'https://res.cloudinary.com/dvnx2ghdw/image/upload/v1753068077/mixmatch_items/rylrtuy2rzg0fisybqpw.jpg', 'mixmatch_items/rylrtuy2rzg0fisybqpw', '2025-07-21 03:21:38'),
(19, 4, 'top', 'https://res.cloudinary.com/dvnx2ghdw/image/upload/v1753068117/mixmatch_items/pqwp1kqkfhsynzo2y7pg.jpg', 'mixmatch_items/pqwp1kqkfhsynzo2y7pg', '2025-07-21 03:22:08'),
(20, 4, 'bottom', 'https://res.cloudinary.com/dvnx2ghdw/image/upload/v1753068143/mixmatch_items/g0pii3smyzjxury1gkl9.jpg', 'mixmatch_items/g0pii3smyzjxury1gkl9', '2025-07-21 03:22:26'),
(21, 4, 'shoes', 'https://res.cloudinary.com/dvnx2ghdw/image/upload/v1753068160/mixmatch_items/frw9ugwilsaspc8x8r8q.jpg', 'mixmatch_items/frw9ugwilsaspc8x8r8q', '2025-07-21 03:22:43'),
(22, 4, 'top', 'https://res.cloudinary.com/dvnx2ghdw/image/upload/v1753068346/mixmatch_items/ytnkxmlkp7zafnckqj9m.jpg', 'mixmatch_items/ytnkxmlkp7zafnckqj9m', '2025-07-21 03:25:49'),
(23, 4, 'bottom', 'https://res.cloudinary.com/dvnx2ghdw/image/upload/v1753068362/mixmatch_items/hge6izljpqn2miklsb3s.jpg', 'mixmatch_items/hge6izljpqn2miklsb3s', '2025-07-21 03:26:07'),
(24, 4, 'shoes', 'https://res.cloudinary.com/dvnx2ghdw/image/upload/v1753068378/mixmatch_items/k01ajnwziygudmxs3ows.jpg', 'mixmatch_items/k01ajnwziygudmxs3ows', '2025-07-21 03:26:23'),
(25, 4, 'top', 'https://res.cloudinary.com/dvnx2ghdw/image/upload/v1753068403/mixmatch_items/maflyjzixbitk9a2aazc.jpg', 'mixmatch_items/maflyjzixbitk9a2aazc', '2025-07-21 03:26:47'),
(26, 4, 'bottom', 'https://res.cloudinary.com/dvnx2ghdw/image/upload/v1753068414/mixmatch_items/ajezpyx3adb1zh5hqgrs.jpg', 'mixmatch_items/ajezpyx3adb1zh5hqgrs', '2025-07-21 03:26:57'),
(27, 4, 'shoes', 'https://res.cloudinary.com/dvnx2ghdw/image/upload/v1753068435/mixmatch_items/vgsmy5gxlqpnezbshuk5.jpg', 'mixmatch_items/vgsmy5gxlqpnezbshuk5', '2025-07-21 03:27:19');

-- --------------------------------------------------------

--
-- Table structure for table `outfits`
--

CREATE TABLE IF NOT EXISTS `outfits` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `top_item_id` int(11) NOT NULL,
  `bottom_item_id` int(11) NOT NULL,
  `shoes_item_id` int(11) NOT NULL,
  `color` varchar(20) DEFAULT NULL,
  `tema` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `outfits`
--

INSERT INTO `outfits` (`id`, `user_id`, `top_item_id`, `bottom_item_id`, `shoes_item_id`, `color`, `tema`, `created_at`) VALUES
(6, 4, 13, 14, 15, 'Merah', 'casual', '2025-07-21 03:23:06'),
(7, 4, 19, 20, 21, 'Coklat', 'streetwear', '2025-07-21 03:23:57'),
(8, 4, 16, 17, 18, 'Biru', 'bohemian', '2025-07-21 03:24:14');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL,
  `username` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(60) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`) VALUES
(4, 'satu', 'satu@email.com', '$2b$10$RiWo3vvPoEs8vYQdwdzAd.I5jFIueh3M9uXDQNHwvd/AaLvmGRcRm', '2025-07-21 03:18:54');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `outfits`
--
ALTER TABLE `outfits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `top_item_id` (`top_item_id`),
  ADD KEY `bottom_item_id` (`bottom_item_id`),
  ADD KEY `shoes_item_id` (`shoes_item_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=28;
--
-- AUTO_INCREMENT for table `outfits`
--
ALTER TABLE `outfits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `items`
--
ALTER TABLE `items`
  ADD CONSTRAINT `items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `outfits`
--
ALTER TABLE `outfits`
  ADD CONSTRAINT `outfits_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `outfits_ibfk_2` FOREIGN KEY (`top_item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `outfits_ibfk_3` FOREIGN KEY (`bottom_item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `outfits_ibfk_4` FOREIGN KEY (`shoes_item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
