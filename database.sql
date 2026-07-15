-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generated on: lun. 22 déc. 2025 at 03:40
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gestion_courrier_instat`
--

-- --------------------------------------------------------

--
-- Table structure for `archives`
--

DROP TABLE IF EXISTS `archives`;
CREATE TABLE IF NOT EXISTS `archives` (
  `id_archive` int NOT NULL AUTO_INCREMENT,
  `id_cou` int NOT NULL,
  `date_archivage` date NOT NULL,
  `motif` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `emplacement` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_archive`),
  UNIQUE KEY `id_cou` (`id_cou`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `archives`
--

INSERT INTO `archives` (`id_archive`, `id_cou`, `date_archivage`, `motif`, `emplacement`) VALUES
(1, 1, '2023-02-15', 'Traitement terminé', 'Armoire A1'),
(6, 22, '2025-08-29', 'fin de l\'analyse', 'etagere A');

-- --------------------------------------------------------

--
-- Table structure for `contacts_externes`
--

DROP TABLE IF EXISTS `contacts_externes`;
CREATE TABLE IF NOT EXISTS `contacts_externes` (
  `id_contac` int NOT NULL AUTO_INCREMENT,
  `nom_contact` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email_contact` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `num_phone` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `organisation` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `type` enum('partenaire','ministere','public') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_contac`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `contacts_externes` (`id_contac`, `nom_contact`, `email_contact`, `num_phone`, `organisation`, `type`) VALUES
(1, 'Ministère de la Santé', 'contact@sante.tn', '0325241719', 'Gouvernement Tunisien', 'ministere'),
(2, 'Société XYZ', 'contact@xyz.com', '0387708450', 'XYZ Corporation', 'partenaire'),
(6, 'sdfsdfsd', 'sdfsdfsd@gmail.com', '0325241717', 'sdfsdf', NULL),
(8, 'fafana', 'skjdfhskjdhf@gmail.com', '0345468686', 'oloontr', 'partenaire');

-- --------------------------------------------------------

--
-- Table structure for `courriers`
--

DROP TABLE IF EXISTS `courriers`;
CREATE TABLE IF NOT EXISTS `courriers` (
  `id_cou` int NOT NULL AUTO_INCREMENT,
  `reference` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `type` enum('entrant','sortant') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `expediteur` int DEFAULT NULL,
  `destinataire` int DEFAULT NULL,
  `objet` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `date_reception` date DEFAULT NULL,
  `date_emission` date DEFAULT NULL,
  `urgence` enum('normal','urgent','prioritaire') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `statut` enum('nouveau','en_traitement','traité','archivé') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'nouveau',
  `fichier_joint` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `id_utilis` int DEFAULT NULL,
  `service_id` int DEFAULT NULL,
  PRIMARY KEY (`id_cou`),
  UNIQUE KEY `reference` (`reference`),
  KEY `id_utilis` (`id_utilis`),
  KEY `courriers_ibfk_2` (`expediteur`),
  KEY `courriers_ibfk_3` (`destinataire`),
  KEY `fk_service` (`service_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `courriers` (`id_cou`, `reference`, `type`, `expediteur`, `destinataire`, `objet`, `date_reception`, `date_emission`, `urgence`, `statut`, `fichier_joint`, `id_utilis`, `service_id`) VALUES
(1, 'REF-2023-001', 'entrant', 1, NULL, 'Demande de statistiques', '2023-01-15', NULL, 'urgent', 'nouveau', 'demande.pdf', 1, 1),
(21, 'REF-2025-002', 'entrant', 1, NULL, 'xcvxcvxcv', '0000-00-00', NULL, 'normal', 'nouveau', NULL, NULL, NULL),
(22, 'REF-2025-003', 'sortant', NULL, 2, 'invitation', NULL, '2025-08-26', 'normal', 'nouveau', '', 1, 3),
(24, 'REF-2025-005', 'entrant', 1, NULL, 'invitation', '2025-08-29', NULL, 'normal', 'nouveau', '1756460426_Screenshot_2025-08-23-15-50-21-627_com.whatsapp.jpg', 1, 2);

-- --------------------------------------------------------

--
-- Table structure for `courrier_service`
--

DROP TABLE IF EXISTS `courrier_service`;
CREATE TABLE IF NOT EXISTS `courrier_service` (
  `id_cou` int NOT NULL,
  `id_servi` int NOT NULL,
  PRIMARY KEY (`id_cou`,`id_servi`),
  KEY `id_servi` (`id_servi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `courrier_service` (`id_cou`, `id_servi`) VALUES
(1, 1),
(1, 2),
(24, 2),
(21, 3),
(22, 3);

-- --------------------------------------------------------

--
-- Table structure for `services`
--

DROP TABLE IF EXISTS `services`;
CREATE TABLE IF NOT EXISTS `services` (
  `id_servi` int NOT NULL AUTO_INCREMENT,
  `nom_servi` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `descrip_servi` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id_servi`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `services` (`id_servi`, `nom_servi`, `descrip_servi`) VALUES
(1, 'Service Informatique', 'Gestion des systèmes informatiques'),
(2, 'Service Juridique', 'Affaires juridiques et conformité'),
(3, 'Service Communication', 'Relations publiques et communication');

-- --------------------------------------------------------

--
-- Table structure for `taches`
--

DROP TABLE IF EXISTS `taches`;
CREATE TABLE IF NOT EXISTS `taches` (
  `id_tach` int NOT NULL AUTO_INCREMENT,
  `id_cou` int NOT NULL,
  `assigne_a` int NOT NULL,
  `descrip` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `date_limit` date DEFAULT NULL,
  `statut` enum('en_attente','en_cours','terminé') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'en_attente',
  PRIMARY KEY (`id_tach`),
  KEY `id_cou` (`id_cou`),
  KEY `assigne_a` (`assigne_a`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `taches` (`id_tach`, `id_cou`, `assigne_a`, `descrip`, `date_limit`, `statut`) VALUES
(4, 2, 1, 'sdfdfs', '2025-08-07', 'en_attente'),
(9, 1, 1, 'sdjskjdkj', '2025-08-08', 'en_attente'),
(10, 1, 1, 'dfdfgdfgdfg', '2025-04-05', 'en_attente'),
(11, 6, 2, 'fafafafafafafafafafafaf', '2025-08-15', 'en_attente'),
(12, 22, 1, 'dgfhfdhfdghfg', '2025-09-05', 'en_attente');

-- --------------------------------------------------------

--
-- Table structure for `utilisateurs`
--

DROP TABLE IF EXISTS `utilisateurs`;
CREATE TABLE IF NOT EXISTS `utilisateurs` (
  `id_utilis` int NOT NULL AUTO_INCREMENT,
  `nom_utilis` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `prenom_utilis` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email_utilis` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `mot_de_passe` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `id_servi` int DEFAULT NULL,
  `role` enum('utilisateur','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'utilisateur',
  PRIMARY KEY (`id_utilis`),
  UNIQUE KEY `email_utilis` (`email_utilis`),
  KEY `id_servi` (`id_servi`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `utilisateurs` (`id_utilis`, `nom_utilis`, `prenom_utilis`, `email_utilis`, `mot_de_passe`, `id_servi`, `role`) VALUES
(1, 'fafana', 'fahendrena', 'fafa@gmail.com', '12345678', 1, 'utilisateur'),
(2, 'Martin', 'Sophie', 'sophie.martin@instat.tn', 'mdp456', 2, 'utilisateur'),
(10, 'sdfsdfs', 'sdfsdfsdfs', 'sdfsdfsddfssf@gmail.com', '$2y$10$O3e/EHPNrd8tWkQobCDH5e2zYCDWNIlJK249E8QixQJdPhKXfZ0V6', 3, 'utilisateur');

--
-- Constraints for table `archives`
--
ALTER TABLE `archives`
  ADD CONSTRAINT `archives_ibfk_1` FOREIGN KEY (`id_cou`) REFERENCES `courriers` (`id_cou`) ON DELETE CASCADE;

--
-- Constraints for table `courriers`
--
ALTER TABLE `courriers`
  ADD CONSTRAINT `courriers_ibfk_1` FOREIGN KEY (`id_utilis`) REFERENCES `utilisateurs` (`id_utilis`),
  ADD CONSTRAINT `courriers_ibfk_2` FOREIGN KEY (`expediteur`) REFERENCES `contacts_externes` (`id_contac`),
  ADD CONSTRAINT `courriers_ibfk_3` FOREIGN KEY (`destinataire`) REFERENCES `contacts_externes` (`id_contac`),
  ADD CONSTRAINT `fk_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id_servi`);

--
-- Constraints for table `courrier_service`
--
ALTER TABLE `courrier_service`
  ADD CONSTRAINT `courrier_service_ibfk_1` FOREIGN KEY (`id_cou`) REFERENCES `courriers` (`id_cou`) ON DELETE CASCADE,
  ADD CONSTRAINT `courrier_service_ibfk_2` FOREIGN KEY (`id_servi`) REFERENCES `services` (`id_servi`);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
