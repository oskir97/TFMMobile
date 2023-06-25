import axios from 'axios';

const postmarkApiKey = '0ba01f13-f02a-462a-9301-48830d93f6e2';

export const enviarCorreo = async (destinatario:string, asunto:string, contenido:string) => {
  try {
    const response = await axios.post(
      'https://api.postmarkapp.com/email',
      {
        From: 'omm35@gcloud.ua.es',
        To: destinatario,
        Subject: asunto,
        HtmlBody: contenido,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Postmark-Server-Token': postmarkApiKey,
        },
      }
    );

    if (response.status === 200) {
      console.log('Correo enviado con éxito');
    } else {
      console.log('Error al enviar el correo');
    }
  } catch (error) {
    console.log('Error al enviar el correo:', error);
  }
};