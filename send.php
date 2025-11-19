<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Coletar dados do formulário
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $subject = strip_tags(trim($_POST["subject"]));
    $message = trim($_POST["message"]);
    
    // Validar dados
    if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Dados inválidos
        http_response_code(400);
        echo "Por favor, preencha todos os campos corretamente.";
        exit;
    }
    
    // Configurar destinatário (substitua pelo seu email)
    $recipient = "lucas.vinicius.loga@gmail.com";
    
    // Configurar assunto do email
    $email_subject = "Novo contato do portfólio: $subject";
    
    // Construir conteúdo do email
    $email_content = "Nome: $name\n";
    $email_content .= "Email: $email\n\n";
    $email_content .= "Assunto: $subject\n\n";
    $email_content .= "Mensagem:\n$message\n";
    
    // Construir headers do email
    $email_headers = "From: $name <$email>";
    
    // Enviar email
    if (mail($recipient, $email_subject, $email_content, $email_headers)) {
        // Email enviado com sucesso
        http_response_code(200);
        echo "success";
    } else {
        // Falha no envio do email
        http_response_code(500);
        echo "Oops! Algo deu errado e não foi possível enviar sua mensagem.";
    }
    
} else {
    // Método não permitido
    http_response_code(403);
    echo "Houve um problema com seu envio. Tente novamente.";
}
?>
