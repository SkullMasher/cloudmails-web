<?php
require 'settings/database.php'; // database settings/credentials

return [
  'settings' => [
    'displayErrorDetails' => true, // set to false in production
    'addContentLengthHeader' => false, // Allow web server to send the content-length header
    'determineRouteBeforeAppMiddleware' => false, // Slim cookbook eloquent
    // Renderer settings
    'renderer' => [
      'template_path' => __DIR__ . '/../templates/',
    ],
    // Monolog settings
    'logger' => [
      'name' => 'slim-app',
      'path' => isset($_ENV['docker']) ? 'php://stdout' : __DIR__ . '/../logs/app.log',
      'level' => \Monolog\Logger::DEBUG,
    ],
    // Eloquent settings
    'db' => $databaseSettings,
  ],
];
