<?php

use Slim\Http\Request;
use Slim\Http\Response;

// Routes
$app->get('/', function (Request $request, Response $response, array $args) {
  $this->logger->info('GET /');

  return $this->renderer->render($response, 'index.phtml');
})->setName('index');

$app->post('/', function (Request $request, Response $response) {
  $indexURL = $this->router->pathFor('index');
  $this->logger->info('POST /');

  $data = $request->getParsedBody();
  // is it a portal authentification or a new user
  if (count($data) === 1) {
    return $this->mailuser_service->isUniq($data);
  } else {
    return $this->mailuser_service->addMail($data);
  }
});

$app->group('/admin', function () use ($app) {
  $app->get('', function (Request $request, Response $response, array $args) {
    $this->logger->info('GET /admin');
    $mail_list = $this->mailuser_service->getAllMail();

    return $this->renderer->render($response, 'admin.phtml', ['mail_list' => $mail_list]);
  })->setName('admin');

  $app->post('', function (Request $request, Response $response) {
    $this->logger->info('POST /admin');

    $data = $request->getParsedBody();
    // is it a portal authentification or a new user
    return $this->mailuser_service->deleteMail($data);
  });
});
