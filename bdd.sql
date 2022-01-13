-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- Client: localhost
-- Généré le: Jeu 13 Janvier 2022 à 13:38
-- Version du serveur: 5.5.24-log
-- Version de PHP: 5.4.3

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données: `bd_test_chantier`
--
CREATE DATABASE `bd_test_chantier` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `bd_test_chantier`;

-- --------------------------------------------------------

--
-- Structure de la table `affecter`
--

CREATE TABLE IF NOT EXISTS `affecter` (
  `ouvrier` int(11) NOT NULL,
  `chantier` int(11) NOT NULL,
  PRIMARY KEY (`ouvrier`,`chantier`),
  KEY `chantier` (`chantier`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `chantier`
--

CREATE TABLE IF NOT EXISTS `chantier` (
  `idChantier` int(11) NOT NULL AUTO_INCREMENT,
  `nomChantier` varchar(30) NOT NULL,
  `proprietaire` int(11) NOT NULL,
  `responsable` int(11) NOT NULL,
  `address` varchar(30) NOT NULL DEFAULT 'Zone de construction Bejaia',
  `fermer` int(11) NOT NULL DEFAULT '0',
  `terminer` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`idChantier`),
  KEY `proprietaire` (`proprietaire`),
  KEY `responsable` (`responsable`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Contenu de la table `chantier`
--

INSERT INTO `chantier` (`idChantier`, `nomChantier`, `proprietaire`, `responsable`, `address`, `fermer`, `terminer`) VALUES
(1, 'Chantier les frere', 1, 36, 'rue 54 - zemourie', 0, 0),
(2, 'Chantier albaraka', 36, 37, 'rue 01 - bejaia provaince', 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `equipement`
--

CREATE TABLE IF NOT EXISTS `equipement` (
  `idEquipement` int(11) NOT NULL AUTO_INCREMENT,
  `prix` int(11) NOT NULL DEFAULT '0',
  `libele` varchar(30) NOT NULL DEFAULT '[unmentioned]',
  `numEquipement` int(11) NOT NULL DEFAULT '0',
  `nb_echantillon` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`idEquipement`),
  UNIQUE KEY `idEquipement` (`idEquipement`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=9 ;

--
-- Contenu de la table `equipement`
--

INSERT INTO `equipement` (`idEquipement`, `prix`, `libele`, `numEquipement`, `nb_echantillon`) VALUES
(1, 200, 'barriere', 1, 1),
(2, 250, 'plaques de roulage', 2, 1),
(3, 100, 'eclairage de chantier', 3, 1),
(4, 10, 'filet de chantier', 4, 1),
(5, 50, 'grille de chantier', 5, 1),
(6, 60, 'mini-grue', 6, 1),
(7, 120, 'baches', 7, 1),
(8, 130, 'ascenseur', 8, 1);

-- --------------------------------------------------------

--
-- Structure de la table `installer`
--

CREATE TABLE IF NOT EXISTS `installer` (
  `equipement` int(11) NOT NULL,
  `chantier` int(11) NOT NULL,
  `nombreArticle` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`equipement`,`chantier`),
  KEY `chantier` (`chantier`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `installer`
--

INSERT INTO `installer` (`equipement`, `chantier`, `nombreArticle`) VALUES
(2, 2, 10),
(4, 1, 7),
(4, 2, 16),
(5, 1, 25);

-- --------------------------------------------------------

--
-- Structure de la table `ouvrier`
--

CREATE TABLE IF NOT EXISTS `ouvrier` (
  `idOuvrier` int(11) NOT NULL,
  `idSpecialite` int(11) NOT NULL,
  PRIMARY KEY (`idOuvrier`),
  KEY `idSpecialite` (`idSpecialite`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `ouvrier`
--

INSERT INTO `ouvrier` (`idOuvrier`, `idSpecialite`) VALUES
(36, 1),
(37, 1),
(1, 3);

-- --------------------------------------------------------

--
-- Structure de la table `personne`
--

CREATE TABLE IF NOT EXISTS `personne` (
  `idPersonne` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(30) NOT NULL DEFAULT '[unmentioned]',
  `prenom` varchar(30) NOT NULL DEFAULT '[unmentioned]',
  `numero` int(11) NOT NULL DEFAULT '0',
  `email` varchar(30) NOT NULL DEFAULT '[unmentioned]',
  `mdp` varchar(30) DEFAULT '0000',
  `admin` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`idPersonne`),
  UNIQUE KEY `numero` (`numero`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=39 ;

--
-- Contenu de la table `personne`
--

INSERT INTO `personne` (`idPersonne`, `nom`, `prenom`, `numero`, `email`, `mdp`, `admin`) VALUES
(1, 'Almamma', 'Amir', 123123, 'aaa@gmail.com', '0000', 0),
(34, 'Almamma', 'Amir', 12311123, 'aaaa@gmail.com', '0000', 0),
(35, 'Bouchouareb', 'Yacine', 14546, 'bbb@gmail.com', '0000', 0),
(36, 'kadi', 'Mazene', 1464687, 'ccc@gmail.com', '0000', 0),
(37, 'Eddine', 'Djawed', 14879213, 'ddd@gmail.com', '0000', 0),
(38, 'Bouchouareb', 'ahmed yacine', 440404, 'yyyyyy@estin.dz', '0000', 0);

-- --------------------------------------------------------

--
-- Structure de la table `specialite`
--

CREATE TABLE IF NOT EXISTS `specialite` (
  `idspecialite` int(11) NOT NULL AUTO_INCREMENT,
  `nomSpecialite` varchar(30) NOT NULL DEFAULT '[unmentioned]',
  PRIMARY KEY (`idspecialite`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Contenu de la table `specialite`
--

INSERT INTO `specialite` (`idspecialite`, `nomSpecialite`) VALUES
(1, 'electricien'),
(2, 'peintre'),
(3, 'macon');

-- --------------------------------------------------------

--
-- Structure de la table `tache`
--

CREATE TABLE IF NOT EXISTS `tache` (
  `idTache` int(11) NOT NULL AUTO_INCREMENT,
  `idChantier` int(11) NOT NULL,
  `nom` varchar(30) NOT NULL DEFAULT '[ukn]',
  `duree` int(11) NOT NULL DEFAULT '30',
  `description` varchar(200) NOT NULL DEFAULT '[ukn]',
  `termine` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`idTache`),
  KEY `chantier` (`idChantier`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Contenu de la table `tache`
--

INSERT INTO `tache` (`idTache`, `idChantier`, `nom`, `duree`, `description`, `termine`) VALUES
(1, 2, 'Installation de support d''asce', 160, 'Dans la zone #12 on a besoin d''une ascenseur pour deplacer les produits', 0),
(2, 2, 'deplacement de materiel', 60, 'il y''a 30 brickets a deplacer dans la zone #8', 0),
(3, 2, 'remplicage d''eau', 78, 'Remplicage des citernes d''eau dans la zone #4', 0),
(4, 2, 'Peinture de la salle S12', 120, 'La salle S12 dans la zone #4 a besoin d''une peinture blanche', 0),
(5, 1, 'Peinture des bureaux dans la z', 120, 'Les bureaux dans la zone #3 ont besoin d''une peinture bleu', 0),
(6, 1, 'reparation des machines zone #', 120, 'Des machines dans la zone #13 ont tembe en panne', 0);

-- --------------------------------------------------------

--
-- Structure de la table `travaille`
--

CREATE TABLE IF NOT EXISTS `travaille` (
  `tache` int(11) NOT NULL,
  `ouvrier` int(11) NOT NULL,
  PRIMARY KEY (`tache`,`ouvrier`),
  KEY `ck_ouvrier` (`ouvrier`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `affecter`
--
ALTER TABLE `affecter`
  ADD CONSTRAINT `affecter_ibfk_1` FOREIGN KEY (`ouvrier`) REFERENCES `ouvrier` (`idOuvrier`),
  ADD CONSTRAINT `affecter_ibfk_2` FOREIGN KEY (`chantier`) REFERENCES `chantier` (`idChantier`);

--
-- Contraintes pour la table `chantier`
--
ALTER TABLE `chantier`
  ADD CONSTRAINT `chantier_ibfk_1` FOREIGN KEY (`proprietaire`) REFERENCES `personne` (`idPersonne`),
  ADD CONSTRAINT `chantier_ibfk_2` FOREIGN KEY (`responsable`) REFERENCES `ouvrier` (`idOuvrier`);

--
-- Contraintes pour la table `installer`
--
ALTER TABLE `installer`
  ADD CONSTRAINT `installer_ibfk_1` FOREIGN KEY (`equipement`) REFERENCES `equipement` (`idEquipement`),
  ADD CONSTRAINT `installer_ibfk_2` FOREIGN KEY (`chantier`) REFERENCES `chantier` (`idChantier`);

--
-- Contraintes pour la table `ouvrier`
--
ALTER TABLE `ouvrier`
  ADD CONSTRAINT `ouvrier_ibfk_1` FOREIGN KEY (`idOuvrier`) REFERENCES `personne` (`idPersonne`),
  ADD CONSTRAINT `ouvrier_ibfk_2` FOREIGN KEY (`idSpecialite`) REFERENCES `specialite` (`idspecialite`);

--
-- Contraintes pour la table `tache`
--
ALTER TABLE `tache`
  ADD CONSTRAINT `chantier` FOREIGN KEY (`idChantier`) REFERENCES `chantier` (`idChantier`);

--
-- Contraintes pour la table `travaille`
--
ALTER TABLE `travaille`
  ADD CONSTRAINT `ck_ouvrier` FOREIGN KEY (`ouvrier`) REFERENCES `ouvrier` (`idOuvrier`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `ck_tache` FOREIGN KEY (`tache`) REFERENCES `tache` (`idTache`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `travaille_ibfk_1` FOREIGN KEY (`tache`) REFERENCES `tache` (`idTache`),
  ADD CONSTRAINT `travaille_ibfk_2` FOREIGN KEY (`ouvrier`) REFERENCES `ouvrier` (`idOuvrier`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
