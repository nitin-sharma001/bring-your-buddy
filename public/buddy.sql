-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 24, 2025 at 02:00 PM
-- Server version: 8.0.39
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `buddy`
--

-- --------------------------------------------------------

--
-- Table structure for table `airport_pickup`
--

CREATE TABLE `airport_pickup` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `photo_document` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `airport_pickup`
--

INSERT INTO `airport_pickup` (`id`, `user_id`, `photo_document`, `created_at`) VALUES
(3, 96, '/airport-images/1745390497675-photo_document-1oth-dmc.webp', '2025-04-23 06:36:04');

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

CREATE TABLE `countries` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`id`, `name`) VALUES
(202, 'Afghanistan'),
(203, 'Albania'),
(204, 'Algeria'),
(205, 'Andorra'),
(206, 'Angola'),
(207, 'Antigua and Barbuda'),
(208, 'Argentina'),
(209, 'Armenia'),
(210, 'Australia'),
(211, 'Austria'),
(212, 'Azerbaijan'),
(213, 'Bahamas'),
(214, 'Bahrain'),
(215, 'Bangladesh'),
(216, 'Barbados'),
(217, 'Belarus'),
(218, 'Belgium'),
(219, 'Belize'),
(220, 'Benin'),
(221, 'Bhutan'),
(222, 'Bolivia'),
(223, 'Bosnia and Herzegovina'),
(224, 'Botswana'),
(225, 'Brazil'),
(226, 'Brunei'),
(227, 'Bulgaria'),
(228, 'Burkina Faso'),
(229, 'Burundi'),
(230, 'Cabo Verde'),
(231, 'Cambodia'),
(232, 'Cameroon'),
(233, 'Canada'),
(234, 'Central African Republic'),
(235, 'Chad'),
(236, 'Chile'),
(237, 'China'),
(238, 'Colombia'),
(239, 'Comoros'),
(240, 'Congo (Congo-Brazzaville)'),
(241, 'Costa Rica'),
(242, 'Croatia'),
(243, 'Cuba'),
(244, 'Cyprus'),
(245, 'Czechia'),
(246, 'Democratic Republic of the Congo'),
(247, 'Denmark'),
(248, 'Djibouti'),
(249, 'Dominica'),
(250, 'Dominican Republic'),
(251, 'Ecuador'),
(252, 'Egypt'),
(253, 'El Salvador'),
(254, 'Equatorial Guinea'),
(255, 'Eritrea'),
(256, 'Estonia'),
(257, 'Eswatini'),
(258, 'Ethiopia'),
(259, 'Fiji'),
(260, 'Finland'),
(261, 'France'),
(262, 'Gabon'),
(263, 'Gambia'),
(264, 'Georgia'),
(265, 'Germany'),
(266, 'Ghana'),
(267, 'Greece'),
(268, 'Grenada'),
(269, 'Guatemala'),
(270, 'Guinea'),
(271, 'Guinea-Bissau'),
(272, 'Guyana'),
(273, 'Haiti'),
(274, 'Honduras'),
(275, 'Hungary'),
(276, 'Iceland'),
(277, 'India'),
(278, 'Indonesia'),
(279, 'Iran'),
(280, 'Iraq'),
(281, 'Ireland'),
(282, 'Israel'),
(283, 'Italy'),
(284, 'Jamaica'),
(285, 'Japan'),
(286, 'Jordan'),
(287, 'Kazakhstan'),
(288, 'Kenya'),
(289, 'Kiribati'),
(290, 'Kuwait'),
(291, 'Kyrgyzstan'),
(292, 'Laos'),
(293, 'Latvia'),
(294, 'Lebanon'),
(295, 'Lesotho'),
(296, 'Liberia'),
(297, 'Libya'),
(298, 'Liechtenstein'),
(299, 'Lithuania'),
(300, 'Luxembourg'),
(301, 'Madagascar'),
(302, 'Malawi'),
(303, 'Malaysia'),
(304, 'Maldives'),
(305, 'Mali'),
(306, 'Malta'),
(307, 'Marshall Islands'),
(308, 'Mauritania'),
(309, 'Mauritius'),
(310, 'Mexico'),
(311, 'Micronesia'),
(312, 'Moldova'),
(313, 'Monaco'),
(314, 'Mongolia'),
(315, 'Montenegro'),
(316, 'Morocco'),
(317, 'Mozambique'),
(318, 'Myanmar'),
(319, 'Namibia'),
(320, 'Nauru'),
(321, 'Nepal'),
(322, 'Netherlands'),
(323, 'New Zealand'),
(324, 'Nicaragua'),
(325, 'Niger'),
(326, 'Nigeria'),
(327, 'North Korea'),
(328, 'North Macedonia'),
(329, 'Norway'),
(330, 'Oman'),
(331, 'Pakistan'),
(332, 'Palau'),
(333, 'Palestine'),
(334, 'Panama'),
(335, 'Papua New Guinea'),
(336, 'Paraguay'),
(337, 'Peru'),
(338, 'Philippines'),
(339, 'Poland'),
(340, 'Portugal'),
(341, 'Qatar'),
(342, 'Romania'),
(343, 'Russia'),
(344, 'Rwanda'),
(345, 'Saint Kitts and Nevis'),
(346, 'Saint Lucia'),
(347, 'Saint Vincent and the Grenadines'),
(348, 'Samoa'),
(349, 'San Marino'),
(350, 'Sao Tome and Principe'),
(351, 'Saudi Arabia'),
(352, 'Senegal'),
(353, 'Serbia'),
(354, 'Seychelles'),
(355, 'Sierra Leone'),
(356, 'Singapore'),
(357, 'Slovakia'),
(358, 'Slovenia'),
(359, 'Solomon Islands'),
(360, 'Somalia'),
(361, 'South Africa'),
(362, 'South Korea'),
(363, 'South Sudan'),
(364, 'Spain'),
(365, 'Sri Lanka'),
(366, 'Sudan'),
(367, 'Suriname'),
(368, 'Sweden'),
(369, 'Switzerland'),
(370, 'Syria'),
(371, 'Tajikistan'),
(372, 'Tanzania'),
(373, 'Thailand'),
(374, 'Timor-Leste'),
(375, 'Togo'),
(376, 'Tonga'),
(377, 'Trinidad and Tobago'),
(378, 'Tunisia'),
(379, 'Turkey'),
(380, 'Turkmenistan'),
(381, 'Tuvalu'),
(382, 'Uganda'),
(383, 'Ukraine'),
(384, 'United Arab Emirates'),
(385, 'United Kingdom'),
(386, 'United States'),
(387, 'Uruguay'),
(388, 'Uzbekistan'),
(389, 'Vanuatu'),
(390, 'Vatican City'),
(391, 'Venezuela'),
(392, 'Vietnam'),
(393, 'Yemen'),
(394, 'Zambia'),
(395, 'Zimbabwe');

-- --------------------------------------------------------

--
-- Table structure for table `country_code`
--

CREATE TABLE `country_code` (
  `code_id` int NOT NULL,
  `phone_code` varchar(15) DEFAULT NULL,
  `country_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `country_code`
--

INSERT INTO `country_code` (`code_id`, `phone_code`, `country_id`) VALUES
(202, '+93', 202),
(203, '+355', 203),
(204, '+213', 204),
(205, '+376', 205),
(206, '+244', 206),
(207, '+1-268', 207),
(208, '+54', 208),
(209, '+374', 209),
(210, '+61', 210),
(211, '+43', 211),
(212, '+994', 212),
(213, '+1-242', 213),
(214, '+973', 214),
(215, '+880', 215),
(216, '+1-246', 216),
(217, '+375', 217),
(218, '+32', 218),
(219, '+501', 219),
(220, '+229', 220),
(221, '+975', 221),
(222, '+591', 222),
(223, '+387', 223),
(224, '+267', 224),
(225, '+55', 225),
(226, '+673', 226),
(227, '+359', 227),
(228, '+226', 228),
(229, '+257', 229),
(230, '+238', 230),
(231, '+855', 231),
(232, '+237', 232),
(233, '+1', 233),
(234, '+236', 234),
(235, '+235', 235),
(236, '+56', 236),
(237, '+86', 237),
(238, '+57', 238),
(239, '+269', 239),
(240, '+242', 240),
(241, '+506', 241),
(242, '+385', 242),
(243, '+53', 243),
(244, '+357', 244),
(245, '+420', 245),
(246, '+243', 246),
(247, '+45', 247),
(248, '+253', 248),
(249, '+1-767', 249),
(250, '+1-809', 250),
(251, '+593', 251),
(252, '+20', 252),
(253, '+503', 253),
(254, '+240', 254),
(255, '+291', 255),
(256, '+372', 256),
(257, '+268', 257),
(258, '+251', 258),
(259, '+679', 259),
(260, '+358', 260),
(261, '+33', 261),
(262, '+241', 262),
(263, '+220', 263),
(264, '+995', 264),
(265, '+49', 265),
(266, '+233', 266),
(267, '+30', 267),
(268, '+1-473', 268),
(269, '+502', 269),
(270, '+224', 270),
(271, '+245', 271),
(272, '+592', 272),
(273, '+509', 273),
(274, '+504', 274),
(275, '+36', 275),
(276, '+354', 276),
(277, '+91', 277),
(278, '+62', 278),
(279, '+98', 279),
(280, '+964', 280),
(281, '+353', 281),
(282, '+972', 282),
(283, '+39', 283),
(284, '+1-876', 284),
(285, '+81', 285),
(286, '+962', 286),
(287, '+7', 287),
(288, '+254', 288),
(289, '+686', 289),
(290, '+965', 290),
(291, '+996', 291),
(292, '+856', 292),
(293, '+371', 293),
(294, '+961', 294),
(295, '+266', 295),
(296, '+231', 296),
(297, '+218', 297),
(298, '+423', 298),
(299, '+370', 299),
(300, '+352', 300),
(301, '+261', 301),
(302, '+265', 302),
(303, '+60', 303),
(304, '+960', 304),
(305, '+223', 305),
(306, '+356', 306),
(307, '+692', 307),
(308, '+222', 308),
(309, '+230', 309),
(310, '+52', 310),
(311, '+691', 311),
(312, '+373', 312),
(313, '+377', 313),
(314, '+976', 314),
(315, '+382', 315),
(316, '+212', 316),
(317, '+258', 317),
(318, '+95', 318),
(319, '+264', 319),
(320, '+674', 320),
(321, '+977', 321),
(322, '+31', 322),
(323, '+64', 323),
(324, '+505', 324),
(325, '+227', 325),
(326, '+234', 326),
(327, '+850', 327),
(328, '+389', 328),
(329, '+47', 329),
(330, '+968', 330),
(331, '+92', 331),
(332, '+680', 332),
(333, '+970', 333),
(334, '+507', 334),
(335, '+675', 335),
(336, '+595', 336),
(337, '+51', 337),
(338, '+63', 338),
(339, '+48', 339),
(340, '+351', 340),
(341, '+974', 341),
(342, '+40', 342),
(343, '+7', 343),
(344, '+250', 344),
(345, '+1-869', 345),
(346, '+1-758', 346),
(347, '+1-784', 347),
(348, '+685', 348),
(349, '+378', 349),
(350, '+239', 350),
(351, '+966', 351),
(352, '+221', 352),
(353, '+381', 353),
(354, '+248', 354),
(355, '+232', 355),
(356, '+65', 356),
(357, '+421', 357),
(358, '+386', 358),
(359, '+677', 359),
(360, '+252', 360),
(361, '+27', 361),
(362, '+82', 362),
(363, '+211', 363),
(364, '+34', 364),
(365, '+94', 365),
(366, '+249', 366),
(367, '+597', 367),
(368, '+46', 368),
(369, '+41', 369),
(370, '+963', 370),
(371, '+992', 371),
(372, '+255', 372),
(373, '+66', 373),
(374, '+670', 374),
(375, '+228', 375),
(376, '+676', 376),
(377, '+1-868', 377),
(378, '+216', 378),
(379, '+90', 379),
(380, '+993', 380),
(381, '+688', 381),
(382, '+256', 382),
(383, '+380', 383),
(384, '+971', 384),
(385, '+44', 385),
(386, '+1', 386),
(387, '+598', 387),
(388, '+998', 388),
(389, '+678', 389),
(390, '+379', 390),
(391, '+58', 391),
(392, '+84', 392),
(393, '+967', 393),
(394, '+260', 394),
(395, '+263', 395);

-- --------------------------------------------------------

--
-- Table structure for table `course_trades`
--

CREATE TABLE `course_trades` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `program_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course_trades`
--

INSERT INTO `course_trades` (`id`, `name`, `program_id`) VALUES
(88, 'Bachelor of Technology in Computer Science (BTech)', 66),
(89, 'Bachelor of Technology in Mechanical Engineering (BTech)', 66),
(90, 'Bachelor of Technology in Civil Engineering (BTech)', 66),
(91, 'Bachelor of Technology in Electrical Engineering (BTech)', 66),
(92, 'Bachelor of Technology in Information Technology (BTech)', 66),
(93, 'Bachelor of Technology in Automobile Engineering (BTech)', 66),
(94, 'Master of Technology in Computer Science (MTech)', 67),
(95, 'Master of Technology in Mechanical Engineering (MTech)', 67),
(96, 'Master of Technology in Civil Engineering (MTech)', 67),
(97, 'Master of Technology in Electrical Engineering (MTech)', 67),
(98, 'Master of Technology in Information Technology (MTech)', 67),
(99, 'Master of Technology in Structural Engineering (MTech)', 67),
(100, 'Doctor of Philosophy in Computer Science (PhD)', 68),
(101, 'Doctor of Philosophy in Mechanical Engineering (PhD)', 68),
(102, 'Doctor of Philosophy in Civil Engineering (PhD)', 68),
(103, 'Doctor of Philosophy in Electrical Engineering (PhD)', 68),
(104, 'Doctor of Philosophy in Information Technology (PhD)', 68),
(105, 'Bachelor of Medicine, Bachelor of Surgery (MBBS)', 69),
(106, 'PhD in Artificial Intelligence', 70),
(107, 'PhD in Data Science', 70),
(108, 'PhD in Business Administration', 70),
(109, 'Master of Business Administration (MBA)', 71),
(110, 'Master of Science in Computer Science (MSc)', 71),
(111, 'Master of Science in Electrical Engineering (MSc)', 71),
(112, 'Master of Arts in Sociology (MA)', 71),
(113, 'Diploma in Civil Engineering', 78),
(114, 'Diploma in Mechanical Engineering', 78),
(115, 'Diploma in Electrical Engineering', 78),
(116, 'Diploma in Electronics Engineering', 78),
(117, 'Diploma in Computer Engineering', 78),
(118, 'Diploma in Information Technology', 78),
(119, 'Diploma in Automobile Engineering', 78),
(120, 'Diploma in Chemical Engineering', 78),
(121, 'Diploma in Textile Technology', 78),
(122, 'Diploma in Plastic Engineering', 78),
(123, 'Diploma in Instrumentation Engineering', 78),
(124, 'Diploma in Mining Engineering', 78),
(125, 'Diploma in Metallurgical Engineering', 78),
(126, 'Diploma in Agricultural Engineering', 78),
(127, 'Marketing', 72),
(128, 'Finance', 72),
(129, 'Human Resource Management', 72),
(130, 'International Business', 72),
(131, 'Physics', 73),
(132, 'Chemistry', 73),
(133, 'Mathematics', 73),
(134, 'Computer Science', 73),
(135, 'Marketing', 74),
(136, 'Finance', 74),
(137, 'Human Resources', 74),
(138, 'Operations Management', 74),
(139, 'Data Science', 75),
(140, 'Biotechnology', 75),
(141, 'Environmental Science', 75),
(142, 'Statistics', 75),
(143, 'English Literature', 76),
(144, 'Economics', 76),
(145, 'Political Science', 76),
(146, 'History', 76);

-- --------------------------------------------------------

--
-- Table structure for table `course_types`
--

CREATE TABLE `course_types` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course_types`
--

INSERT INTO `course_types` (`id`, `name`) VALUES
(3, 'Diploma'),
(2, 'Postgraduate'),
(1, 'Undergraduate');

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `photograph` varchar(255) DEFAULT NULL,
  `parent_affidavit` varchar(255) DEFAULT NULL,
  `proof_of_residence` varchar(255) DEFAULT NULL,
  `receipt_of_paid_fees` varchar(255) DEFAULT NULL,
  `itinerary_ticket` varchar(255) DEFAULT NULL,
  `bank_statement` varchar(255) DEFAULT NULL,
  `bank_statement_owner_id` varchar(255) DEFAULT NULL,
  `passport_copy` varchar(255) DEFAULT NULL,
  `educational_certificates` varchar(255) DEFAULT NULL,
  `id_copy` varchar(255) DEFAULT NULL,
  `offer_letter` varchar(255) DEFAULT NULL,
  `offer_letter_school` varchar(255) DEFAULT NULL,
  `admission_letter` varchar(255) DEFAULT NULL,
  `bonafide_certificate` varchar(255) DEFAULT NULL,
  `student_undertaking_form` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`id`, `user_id`, `photograph`, `parent_affidavit`, `proof_of_residence`, `receipt_of_paid_fees`, `itinerary_ticket`, `bank_statement`, `bank_statement_owner_id`, `passport_copy`, `educational_certificates`, `id_copy`, `offer_letter`, `offer_letter_school`, `admission_letter`, `bonafide_certificate`, `student_undertaking_form`, `created_at`, `updated_at`) VALUES
(3, 96, '/check-list-documents/1745302198916-photograph-Buy-Fake-Diploma-from-India-min.webp', '/check-list-documents/1745302160117-parent_affidavit-bachelor.pdf', '/check-list-documents/1745302160128-proof_of_residence-bachelor.pdf', '/check-list-documents/1745302160161-receipt_of_paid_fees-bachelor.pdf', '/check-list-documents/1745302160171-itinerary_ticket-bachelor.pdf', '/check-list-documents/1745302160173-bank_statement-bachelor.pdf', '/check-list-documents/1745302160174-bank_statement_owner_id-bachelor.pdf', '/check-list-documents/1745302160505-passport_copy-bachelor.pdf', '/check-list-documents/1745302160508-educational_certificates-bachelor.pdf', '/check-list-documents/1745302160509-id_copy-bachelor.pdf', '/check-list-documents/1745302160075-offer_letter-bachelor.pdf', '/check-list-documents/1745302160100-offer_letter_school-bachelor.pdf', '/check-list-documents/1745302160080-admission_letter-bachelor.pdf', '/check-list-documents/1745302160085-bonafide_certificate-bachelor.pdf', '/check-list-documents/1745302160088-student_undertaking_form-bachelor.pdf', '2025-04-22 06:09:20', '2025-04-22 06:09:58');

-- --------------------------------------------------------

--
-- Table structure for table `embassy`
--

CREATE TABLE `embassy` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `embassy_email` varchar(1000) DEFAULT NULL,
  `result_document` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `embassy`
--

INSERT INTO `embassy` (`id`, `user_id`, `embassy_email`, `result_document`, `created_at`) VALUES
(4, 97, 'embassy@gmail.com', '/embassy/embassy-result/1745477500988-result_document-Buy-Fake-Diploma-from-India-min.webp', '2025-04-24 06:50:53'),
(5, 96, 'embassy@gmail.com', NULL, '2025-04-24 09:23:51');

-- --------------------------------------------------------

--
-- Table structure for table `programs`
--

CREATE TABLE `programs` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `course_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `programs`
--

INSERT INTO `programs` (`id`, `name`, `course_id`) VALUES
(66, 'Bachelor of Technology (BTech)', 1),
(67, 'Bachelor of Engineering (BEng)', 1),
(68, 'Master of Technology (MTech)', 2),
(69, 'Master of Engineering (MEng)', 2),
(70, 'Doctor of Philosophy (PhD)', 2),
(71, 'Bachelor of Medicine, Bachelor of Surgery (MBBS)', 1),
(72, 'Bachelor of Business Administration (BBA)', 1),
(73, 'Bachelor of Science (BSc)', 1),
(74, 'Master of Business Administration (MBA)', 2),
(75, 'Master of Science (MSc)', 2),
(76, 'Master of Arts (MA)', 2),
(78, 'Diploma', 3);

-- --------------------------------------------------------

--
-- Table structure for table `reminder`
--

CREATE TABLE `reminder` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `appointment_date` datetime NOT NULL,
  `appointment_time` varchar(200) COLLATE utf8mb4_general_ci DEFAULT '12 : 00',
  `date_document` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reminder`
--

INSERT INTO `reminder` (`id`, `user_id`, `appointment_date`, `appointment_time`, `date_document`, `created_at`) VALUES
(11, 96, '2025-04-09 00:00:00', '17:56', '/embassy/1745487337092-date_document-bachelor.pdf', '2025-04-22 09:59:20'),
(12, 97, '2025-04-23 00:00:00', '17:53', '/embassy/1745486479453-date_document-bachelor.pdf', '2025-04-24 06:48:19');

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `departure_datetime` datetime NOT NULL,
  `destination_datetime` datetime NOT NULL,
  `departure_port` varchar(100) NOT NULL,
  `destination_port` varchar(100) NOT NULL,
  `ticket_document` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`id`, `user_id`, `departure_datetime`, `destination_datetime`, `departure_port`, `destination_port`, `ticket_document`, `created_at`) VALUES
(1, 95, '2025-04-20 18:11:00', '2025-04-21 19:13:00', 'JFK Airport', 'HealthRow', '/airport-images/1745055581923-ticket_document-bachelor.pdf', '2025-04-19 09:39:41'),
(2, 96, '2025-04-25 14:22:00', '2025-04-28 15:23:00', 'JFG', 'Hallow', '/airport-images/1745300986521-ticket_document-1oth-dmc.webp', '2025-04-22 05:49:46');

-- --------------------------------------------------------

--
-- Table structure for table `universities`
--

CREATE TABLE `universities` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `program_id` int NOT NULL,
  `university_country_id` int DEFAULT NULL,
  `location` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `campus` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fees` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `annual_fees` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` varchar(1000) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `universities`
--

INSERT INTO `universities` (`id`, `name`, `program_id`, `university_country_id`, `location`, `campus`, `fees`, `annual_fees`, `description`) VALUES
(37, 'University of Tech Innovation', 66, 386, 'San Francisco, USA', 'Innovation Campus', '55000', '32000', 'A leading university focusing on cutting-edge technology programs and research in AI and Robotics.'),
(38, 'Tech Masters University', 66, 386, 'Austin, USA', 'Downtown Campus', '53000', '31000', 'Specializes in advanced technology courses and research.'),
(39, 'Global Tech Academy', 66, 385, 'London, UK', 'Central Campus', '56000', '33000', 'Provides global exposure in tech industries with partnerships worldwide.'),
(40, 'Innovative University', 66, 265, 'Berlin, Germany', 'East Campus', '54000', '32500', 'A hub for tech innovation and research in computer science and AI.'),
(41, 'Tech Frontier University', 66, 285, 'Tokyo, Japan', 'Main Campus', '58000', '34000', 'A leader in robotics, artificial intelligence, and engineering education.'),
(42, 'FutureTech University', 66, 261, 'Paris, France', 'Central Campus', '50000', '30000', 'A future-focused university offering tech programs and research opportunities.'),
(43, 'International Tech School', 66, 386, 'New York, USA', 'Downtown Campus', '52000', '31500', 'Provides specialized programs in software engineering and IT infrastructure.'),
(44, 'NextGen University', 66, 356, 'Singapore', 'Innovation Hub', '60000', '35000', 'Focuses on next-generation technologies and cutting-edge research in AI and robotics.'),
(45, 'Advanced Studies University', 67, 265, 'Berlin, Germany', 'North Campus', '48000', '28000', 'Known for its advanced research in artificial intelligence, machine learning, and data science.'),
(46, 'Future Leaders University', 67, 386, 'Boston, USA', 'West Campus', '47000', '27500', 'Offers an interdisciplinary approach to AI, data science, and business.'),
(47, 'International Institute of Technology', 67, 385, 'London, UK', 'Tech Campus', '49000', '29000', 'Leading in AI and machine learning education, offering hands-on experience.'),
(48, 'AI Research University', 67, 386, 'San Francisco, USA', 'Silicon Valley Campus', '52000', '31000', 'Focused on artificial intelligence and data-driven research.'),
(49, 'Innovative Learning University', 67, 210, 'Sydney, Australia', 'Central Campus', '51000', '30500', 'Prepares students for careers in AI, machine learning, and computer vision.'),
(50, 'Global University of Technology', 67, 233, 'Toronto, Canada', 'Downtown Campus', '53000', '32000', 'Leads in innovative research and teaching in AI and robotics.'),
(51, 'Tech Research University', 67, 369, 'Zurich, Switzerland', 'Global Campus', '54000', '32500', 'Research-driven programs in AI, deep learning, and data science.'),
(52, 'Science and AI University', 67, 261, 'Paris, France', 'Research Campus', '50000', '30000', 'Specializes in AI research, providing students with cutting-edge knowledge and skills.'),
(53, 'Global Research Institute', 68, 233, 'Toronto, Canada', 'Main Campus', '51000', '29000', 'An institution focused on interdisciplinary research and advanced studies in science and engineering.'),
(54, 'Innovative Science University', 68, 386, 'Los Angeles, USA', 'Central Campus', '53000', '30000', 'Known for advanced research in environmental science and engineering.'),
(55, 'Tech and Science University', 68, 261, 'Paris, France', 'Science Campus', '55000', '31000', 'Offering programs in interdisciplinary science and technology research.'),
(56, 'International Research University', 68, 356, 'Singapore', 'East Campus', '52000', '30000', 'Leads in interdisciplinary research in technology and sciences.'),
(57, 'Future Innovations University', 68, 265, 'Berlin, Germany', 'West Campus', '54000', '32500', 'Offers innovative programs in environmental science and sustainable technology.'),
(58, 'Tech and Research Academy', 68, 369, 'Zurich, Switzerland', 'Global Campus', '56000', '33000', 'Provides cutting-edge education and research in science and technology fields.'),
(59, 'Interdisciplinary Research University', 68, 386, 'New York, USA', 'Innovation Campus', '58000', '34000', 'Focuses on cross-disciplinary research to solve global challenges in technology and science.'),
(60, 'Global Science Institute', 68, 385, 'London, UK', 'Tech Research Campus', '57000', '33500', 'Leads scientific advancements through research in various fields of study.'),
(61, 'International University of Sciences', 69, 210, 'Sydney, Australia', 'East Campus', '47000', '26000', 'Offers a wide range of programs in medical and environmental sciences, with a focus on global sustainability.'),
(62, 'Sustainability and Science University', 69, 233, 'Vancouver, Canada', 'Main Campus', '48000', '26500', 'Focuses on sustainable development and environmental science.'),
(63, 'Global Environmental University', 69, 265, 'Berlin, Germany', 'North Campus', '49000', '27000', 'Leads in research on climate change and global sustainability.'),
(64, 'Future Science Academy', 69, 386, 'Los Angeles, USA', 'South Campus', '50000', '27500', 'Prepares students for careers in environmental and earth sciences.'),
(65, 'GreenTech University', 69, 385, 'London, UK', 'Central Campus', '51000', '28000', 'Provides education in green technologies and environmental management.'),
(66, 'Sustainable Innovation University', 69, 233, 'Toronto, Canada', 'West Campus', '53000', '29000', 'Offers programs aimed at creating innovative solutions for environmental challenges.'),
(67, 'Environmental Solutions University', 69, 386, 'New York, USA', 'Innovation Campus', '55000', '30000', 'A leading university in the field of environmental science and sustainable practices.'),
(68, 'Sustainability Research Institute', 69, 261, 'Paris, France', 'Research Campus', '54000', '29500', 'A center for research in sustainability and green technologies.'),
(69, 'Innovation and Research Institute', 70, 285, 'Tokyo, Japan', 'Innovation Campus', '53000', '28500', 'A prestigious institute known for its research and innovation in emerging technologies.'),
(71, 'Advanced Technologies University', 70, 265, 'Berlin, Germany', 'Central Campus', '56000', '31000', 'Focuses on research in advanced technology, engineering, and applied sciences.'),
(72, 'Tech Innovation Academy', 70, 386, 'San Francisco, USA', 'Innovation Campus', '59000', '32000', 'Offers specialized programs in the innovation and research of next-gen technologies.'),
(73, 'Global Engineering Institute', 70, 385, 'London, UK', 'Tech Campus', '58000', '31500', 'Known for its excellence in engineering and applied technology research.'),
(74, 'Tech and Research Institute', 70, 261, 'Paris, France', 'Research Campus', '55000', '30500', 'Leads in technological research and development, with a focus on sustainable solutions.'),
(75, 'FutureTech Academy', 70, 233, 'Toronto, Canada', 'Innovation Hub', '57000', '31000', 'Specializes in future technologies, focusing on AI, robotics, and advanced engineering.'),
(76, 'International Research University', 70, 210, 'Sydney, Australia', 'Central Campus', '60000', '33000', 'Provides a platform for cutting-edge research in technology and science.'),
(77, 'Next Generation Research Institute', 71, 386, 'New York, USA', 'Tech Campus', '56000', '33000', 'Focuses on next-generation technology research and innovations in AI.'),
(78, 'Global Institute of Technology', 71, 261, 'Paris, France', 'Innovation Campus', '57000', '33500', 'A leading institution in technological innovation and research in applied sciences.'),
(79, 'Tech Research and Innovation University', 71, 385, 'London, UK', 'Main Campus', '59000', '34000', 'Provides a strong focus on research and development of new technologies.'),
(80, 'Future Tech Academy', 71, 285, 'Tokyo, Japan', 'Central Campus', '60000', '35000', 'A hub for next-gen technology and engineering education, fostering innovation.'),
(81, 'International Science and Tech University', 71, 265, 'Berlin, Germany', 'Tech Campus', '61000', '35500', 'Known for cutting-edge research and education in computer science, engineering, and technology.'),
(82, 'Global Technology Innovation University', 71, 356, 'Singapore', 'Innovation Hub', '62000', '36000', 'Leading the world in technological research, with a focus on AI and robotics.'),
(83, 'Innovation Leaders Academy', 71, 386, 'San Francisco, USA', 'Innovation Campus', '63000', '37000', 'Offers transformative education in technology, innovation, and entrepreneurship.'),
(84, 'Tech Excellence Institute', 71, 233, 'Toronto, Canada', 'Research Campus', '64000', '38000', 'A research-driven university with a focus on breakthrough technologies.'),
(85, 'Global Research and Tech Academy', 72, 369, 'Zurich, Switzerland', 'Innovation Campus', '65000', '38500', 'A world leader in research in technology, computer science, and data science.'),
(86, 'Tech Innovators University', 72, 386, 'Los Angeles, USA', 'Main Campus', '66000', '39000', 'Focuses on technology innovations and breakthrough research in artificial intelligence.'),
(87, 'Research and Technology Institute', 72, 265, 'Berlin, Germany', 'Innovation Campus', '67000', '39500', 'Offers cutting-edge education in technology with a research-driven approach.'),
(88, 'Tech and Science University', 72, 385, 'London, UK', 'Research Campus', '68000', '40000', 'Prepares students for high-impact careers in tech and applied sciences.'),
(89, 'Advanced Technologies Institute', 72, 233, 'Toronto, Canada', 'Main Campus', '69000', '40500', 'An institute dedicated to advancing research and education in emerging technologies.'),
(90, 'Global Science and Technology Academy', 72, 386, 'San Francisco, USA', 'Innovation Campus', '70000', '41000', 'Leads in technological research with a focus on AI, robotics, and machine learning.'),
(91, 'Innovation Research University', 72, 261, 'Paris, France', 'Tech Research Campus', '71000', '41500', 'Offers advanced programs in technology research and AI innovations.'),
(92, 'Cutting Edge Tech University', 72, 356, 'Singapore', 'Innovation Campus', '72000', '42000', 'A premier university for cutting-edge research and development in technology.'),
(93, 'University of Tech Innovation', 78, 386, 'San Francisco USA', 'Innovation Campus', '55000', '55000', 'A leading university focusing on cutting-edge tech...'),
(94, 'Tech Masters University', 78, 386, 'Austin USA', 'Downtown Campus', '53000', '53000', 'Specializes in advanced technology courses and research...'),
(95, 'Global Tech Academy', 78, 385, 'London UK', 'Central Campus', '56000', '56000', 'Provides global exposure in tech industries with practical learning...'),
(96, 'Innovative University', 78, 265, 'Berlin Germany', 'East Campus', '54000', '54000', 'A hub for tech innovation and research in computer science...'),
(97, 'Tech Frontier University', 78, 285, 'Tokyo Japan', 'Main Campus', '58000', '58000', 'A leader in robotics, artificial intelligence, and innovation...'),
(98, 'Global Business School', 73, 386, 'New York, USA', 'Downtown Campus', '45000', '15000', 'A top-tier BBA institution focused on global business strategies.'),
(99, 'International School of Management', 73, 385, 'London, UK', 'Central Campus', '47000', '15500', 'Offers diverse BBA specializations with global exposure.'),
(100, 'Metropolitan Business University', 73, 233, 'Toronto, Canada', 'Metro Campus', '44000', '14800', 'Renowned for modern business curriculum and industry tie-ups.'),
(101, 'Elite Business Institute', 73, 356, 'Singapore', 'Innovation Campus', '46000', '15200', 'Famous for experiential BBA learning and internships.'),
(102, 'City Business Academy', 73, 384, 'Dubai, UAE', 'Financial District Campus', '43000', '14500', 'Focused on finance, marketing, and entrepreneurship studies.'),
(103, 'Science and Tech College', 74, 386, 'Boston, USA', 'Science Campus', '42000', '14000', 'Offers leading-edge education in core sciences.'),
(104, 'Modern Science University', 74, 265, 'Berlin, Germany', 'North Campus', '44000', '14500', 'Research-focused institution in physical sciences.'),
(105, 'Innovative Science Institute', 74, 210, 'Sydney, Australia', 'Central Campus', '43000', '14300', 'Provides quality education in physics, chemistry, and biology.'),
(106, 'Future Science College', 74, 261, 'Paris, France', 'West Campus', '41000', '13700', 'Known for interdisciplinary science programs.'),
(107, 'Advanced BSc Academy', 74, 285, 'Tokyo, Japan', 'East Campus', '45000', '15000', 'Offers modern labs and practical learning in sciences.'),
(108, 'Global Management University', 75, 386, 'San Francisco, USA', 'Silicon Valley Campus', '60000', '20000', 'Premier MBA school with strong alumni network.'),
(109, 'TechBiz School of Management', 75, 265, 'Berlin, Germany', 'Tech Campus', '58000', '19500', 'Blends tech innovation with MBA leadership skills.'),
(110, 'Leadership & Strategy Institute', 75, 356, 'Singapore', 'Business Campus', '57000', '19000', 'Specializes in leadership, operations, and strategic thinking.'),
(111, 'Executive MBA Academy', 75, 385, 'London, UK', 'City Campus', '59000', '19800', 'Known for executive training and corporate tie-ins.'),
(112, 'Metro Global Business School', 75, 233, 'Toronto, Canada', 'Downtown Campus', '61000', '20200', 'Focused on entrepreneurship, finance, and marketing.'),
(113, 'Institute of Advanced Science', 76, 369, 'Zurich, Switzerland', 'Global Campus', '55000', '18500', 'Advanced MSc programs in data science and AI.'),
(114, 'NextGen Science University', 76, 385, 'London, UK', 'Research Campus', '53000', '17800', 'Emphasizes innovation and scientific research.'),
(115, 'Innovative Tech and Science Academy', 76, 386, 'Austin, USA', 'Innovation Campus', '56000', '18700', 'Equipped for advanced studies in environmental and life sciences.'),
(116, 'Future Research Institute', 76, 261, 'Paris, France', 'Science Hub', '54000', '18200', 'Provides an international MSc experience in multiple science fields.'),
(117, 'International Science School', 76, 265, 'Berlin, Germany', 'East Campus', '52000', '17500', 'Global leader in research-oriented MSc programs.');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `profile_img` varchar(1000) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `phone_number` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `country_id` int NOT NULL,
  `university_country` varchar(400) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `id_proof` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `otp` varchar(4) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `otp_expires_at` datetime DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT '0',
  `program_id` int DEFAULT NULL,
  `university_id` int DEFAULT NULL,
  `tenth_certificate` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `twelfth_certificate` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `bachelor_certificate` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `other_certificate` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `course_trade_id` int DEFAULT NULL,
  `course_type_id` int DEFAULT NULL,
  `offer_letter` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `admission_letter` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bonafide_letter` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `visa` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payment_receipt` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payment_status` int DEFAULT '0',
  `offer_letter_status` int DEFAULT '0',
  `document_verified_status` int NOT NULL DEFAULT '0',
  `application_submitted` int NOT NULL DEFAULT '0',
  `is_eligible` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `profile_img`, `email`, `password`, `phone_number`, `country_id`, `university_country`, `id_proof`, `otp`, `otp_expires_at`, `is_verified`, `created_at`, `updated_at`, `is_deleted`, `program_id`, `university_id`, `tenth_certificate`, `twelfth_certificate`, `bachelor_certificate`, `other_certificate`, `course_trade_id`, `course_type_id`, `offer_letter`, `admission_letter`, `bonafide_letter`, `visa`, `payment_receipt`, `payment_status`, `offer_letter_status`, `document_verified_status`, `application_submitted`, `is_eligible`) VALUES
(96, 'Nithin Sharma', 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png', 'sharmanitin.mcl@gmail.com', '$2b$10$RyQUNx5zG1qnJbD614RpOOE3L0ZXmDgWU3g6cRFkfCyxc7FZVMILq', '9015076296', 277, '210', '/uploads/1745299614999-79w6vb0-bachelor.pdf', '5772', '2025-04-22 11:06:55', 1, '2025-04-22 05:26:55', '2025-04-24 09:25:23', 0, 66, 37, '/uploads/1745299614592-84mve7l-10th_dmc.pdf', '/uploads/1745299614863-amvteu9-12th_non_medial.pdf', NULL, '/uploads/1745299615009-x7xlg12-bachelor.pdf', 88, 1, '/offerletters/96_Offer_Letter.pdf', '/documents/96_Admission_Letter.pdf', '/documents/96_Bonafide_Letter.pdf', '/documents/96_Visa.pdf', '/documents/96_Payment_Receipt.pdf', 1, 1, 1, 1, 1),
(97, 'Nitin Sharma', 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png', 'tomato@gmail.com', '$2b$10$gf5Q4TgZPuzM9Hw6HCKst.IcUmXWHtCYI7BYAT8dqVowvjpZj4fFO', '9015076296', 233, '210', '/uploads/1745474377641-4gckq20-bachelor.pdf', '7066', '2025-04-24 11:39:38', 1, '2025-04-24 05:59:37', '2025-04-24 09:14:17', 0, 66, 49, '/uploads/1745474377591-x6fv35v-10th_dmc.pdf', '/uploads/1745474377604-3oufrma-12th_non_medial.pdf', NULL, '/uploads/1745474377655-xb2v0md-bachelor.pdf', 88, 1, '/offerletters/97_Offer_Letter.pdf', '/documents/97_Admission_Letter.pdf', '/documents/97_Bonafide_Letter.pdf', '/documents/97_Visa.pdf', '/documents/97_Payment_Receipt.pdf', 1, 1, 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `visa`
--

CREATE TABLE `visa` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `visa_document` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `visa_decision_letter` varchar(1000) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `visa`
--

INSERT INTO `visa` (`id`, `user_id`, `visa_document`, `visa_decision_letter`, `created_at`) VALUES
(4, 96, '/embassy/visa-result/1745314618174-visa_document-1oth-dmc.webp', '/embassy/visa-result/1745314463405-visa_decision_letter-bachelor.pdf', '2025-04-22 09:34:23'),
(5, 96, '/embassy/visa-result/1745314618174-visa_document-1oth-dmc.webp', '/embassy/visa-result/1745314469270-visa_decision_letter-bachelor.pdf', '2025-04-22 09:34:29'),
(6, 96, NULL, '/embassy/visa-result/1745314639338-visa_decision_letter-12th_arts.pdf', '2025-04-22 09:37:19');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `airport_pickup`
--
ALTER TABLE `airport_pickup`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `country_code`
--
ALTER TABLE `country_code`
  ADD PRIMARY KEY (`code_id`),
  ADD KEY `fk_country` (`country_id`);

--
-- Indexes for table `course_trades`
--
ALTER TABLE `course_trades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `program_id` (`program_id`);

--
-- Indexes for table `course_types`
--
ALTER TABLE `course_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `embassy`
--
ALTER TABLE `embassy`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `programs`
--
ALTER TABLE `programs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `fk_programs_course` (`course_id`);

--
-- Indexes for table `reminder`
--
ALTER TABLE `reminder`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `universities`
--
ALTER TABLE `universities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `program_id` (`program_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `country_id` (`country_id`),
  ADD KEY `program_id` (`program_id`),
  ADD KEY `university_id` (`university_id`);

--
-- Indexes for table `visa`
--
ALTER TABLE `visa`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `airport_pickup`
--
ALTER TABLE `airport_pickup`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `countries`
--
ALTER TABLE `countries`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=396;

--
-- AUTO_INCREMENT for table `course_trades`
--
ALTER TABLE `course_trades`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=147;

--
-- AUTO_INCREMENT for table `course_types`
--
ALTER TABLE `course_types`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `embassy`
--
ALTER TABLE `embassy`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `programs`
--
ALTER TABLE `programs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT for table `reminder`
--
ALTER TABLE `reminder`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `universities`
--
ALTER TABLE `universities`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- AUTO_INCREMENT for table `visa`
--
ALTER TABLE `visa`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `country_code`
--
ALTER TABLE `country_code`
  ADD CONSTRAINT `fk_country` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`);

--
-- Constraints for table `course_trades`
--
ALTER TABLE `course_trades`
  ADD CONSTRAINT `course_trades_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `programs`
--
ALTER TABLE `programs`
  ADD CONSTRAINT `fk_programs_course` FOREIGN KEY (`course_id`) REFERENCES `course_types` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reminder`
--
ALTER TABLE `reminder`
  ADD CONSTRAINT `reminder_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `universities`
--
ALTER TABLE `universities`
  ADD CONSTRAINT `universities_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `users_ibfk_3` FOREIGN KEY (`university_id`) REFERENCES `universities` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
