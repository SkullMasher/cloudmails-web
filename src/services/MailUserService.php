<?php
class MailUserService {

  private $logger;
  private $mail;

  function __construct($logger)
  {
    $this->logger = $logger;
    $this->virtualuser = new VirtualUser;
  }

  private function mt_rand_str ($l, $c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890') {
    for ($s = '', $cl = strlen($c)-1, $i = 0; $i < $l; $s .= $c[mt_rand(0, $cl)], ++$i);
      return $s;
  }

  private function strip_whitespace($str) {
      return preg_replace('/\s+/', ' ', $str);
  }

  private function sanitize($data) {
    $data_count = count($data);

    for ($i=0; $i < $data_count; $i++) {
      // Strip whitespace in and out
      $data[$i] = $this->strip_whitespace($data[$i]);
      // Convert new lines
      $data[$i] = str_replace("<br>", "\n", $data[$i]);
      $data[$i] = str_replace("</p>", "\n", $data[$i]);
      $data[$i] = str_replace("</div>", "\n", $data[$i]);
      // Avoid XSS
      $data[$i] = filter_var($data[$i], FILTER_SANITIZE_STRING);
      $this->logger->info($data[$i]);
    }

    return $data;
  }

  public function addMail($data) {
    $mail = strtolower($data[0]);
    $password = $data[1];
    $salt = substr(sha1(rand()), 0, 16);
    $hashedPassword = crypt($password, "$6$$salt");

    if (empty($mail) || empty($password)) {
      return 'empty';
    } else {
      try {
        $this->virtualuser->domain_id = 1;
        $this->virtualuser->email = $mail . '@mailmaster.fr';
        $this->virtualuser->password = $hashedPassword;
        $this->virtualuser->save();
        return json_encode(true);
      } catch (Exception $e) {
        return $e->getCode();
      }
    }
  }

  public function getMail($seed) {
    $wishExist = $this->virtualuser->where('seed', '=', $seed)->exists();
    $wish = $this->virtualuser->where('seed', '=', $seed)->first();

    if ($wishExist) {
      return $wish;
    } else {
      return null;
    }
  }

  public function getAllMail() {
    return $this->virtualuser->all();
  }

  public function deleteMail($data) {
    $this->virtualuser->destroy($data[0]);
    return true;
  }

  public function isUniq($data) {
    $mail = $data[0] . '@mailmaster.fr';
    return json_encode($this->virtualuser->where('email', '=', $mail)->doesntExist());
  }
}
