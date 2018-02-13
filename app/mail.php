<?php 
$whatever=$_POST['whatever'];
$username=$_POST['username'];
$email=$_POST['email'];
$msg=$_POST['msg'];
$message = "
Форма: ".htmlspecialchars($whatever)."<br />
Имя: ".htmlspecialchars($username)."<br />
Эл. почта : ".htmlspecialchars($email)."<br />
Сообщение: ".htmlspecialchars($msg);

require_once('phpmailer/PHPMailerAutoload.php');
$mail = new PHPMailer;
$mail->CharSet = 'utf-8';

$mail->isSMTP();
$mail->Host = 'smtp.gmail.com';
$mail->SMTPAuth = true;
$mail->Username = 'example@gmail.com';
$mail->Password = 'PASSWORD';
$mail->SMTPSecure = 'ssl';
$mail->Port = 465;

$mail->setFrom('example@gmail.com', 'Заявка');
$mail->addAddress('target@mail.ru');
$mail->isHTML(true);

$mail->Subject = 'Заявка';
$mail->Body    = $message;

if(!$mail->send()) {
    echo 'Message could not be sent.';
    echo 'Mailer Error: ' . $mail->ErrorInfo;
} else {
    echo 'Message has been sent';
}

?>