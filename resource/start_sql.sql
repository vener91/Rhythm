CREATE TABLE  `rhythm`.`users` (
`id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY ,
`username` VARCHAR( 200 ) NOT NULL ,
`password` VARCHAR( 200 ) NOT NULL ,
`email` VARCHAR( 200 ) NOT NULL ,
`last_modified` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
UNIQUE (
`username` ,
`email`
)
) ENGINE = INNODB;
