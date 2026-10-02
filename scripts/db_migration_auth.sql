CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `firebase_uid` VARCHAR(128) UNIQUE NULL,
  `username` VARCHAR(100) NOT NULL DEFAULT '',
  `email` VARCHAR(150) NULL,
  `phone` VARCHAR(30) NULL,
  `password` VARCHAR(255) NULL,
  `role` VARCHAR(20) DEFAULT 'customer',
  `auth_provider` VARCHAR(30) DEFAULT 'phone',
  `avatar_url` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_phone` (`phone`),
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_firebase_uid` (`firebase_uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
