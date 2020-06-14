"use strict";

const Phone = use("App/Models/Phone");
const Chat = use("App/Models/Chat");

class WhatsappController {
  async store({ response, request }) {
    const { phone, message } = request.all();
    const user = await Phone.query().where("phone", phone).first();
    const welcome = ["Olá", "ola", "oi", "ei", "Oi", "1", "2", "Ola"];
    const isnum = /^\d+$/.test(message);

    if ((isnum && message.length === 8) || message.length === 6) {
      return response.status(200).send({
        status: true,
        messages: [
          "Legal, agora preciso do seu CPF. Apenas números, sem pontos ou traços.",
        ],
      });
    }

    if (isnum && message.length === 11) {
      return response.status(200).send({
        status: true,
        messages: [
          "Isso mesmo. Agora pra finalizar, como você gostaria que eu te chamasse.",
        ],
      });
    }

    if (!isnum && message.length === 11) {
      return response.status(200).send({
        status: true,
        messages: ["Digite um CPF válido, contendo somente números."],
      });
    }

    if (!user) {
      // await Phone.create();
      await Chat.create({
        message: 1,
        status: true,
        phone,
      });

      return response.status(200).send({
        status: true,
        messages: [
          "Olá, me chamo Tony e sou seu assistente virtual que irá lhe ajudar. Antes de mais nada, verifiquei aqui que esse é seu primeiro contato conosco. Vou precisar de algumas informações para podermos continuar.",
          "Digite sua data de nascimento. Apenas números (dia, mês e ano). Por exemplo: 07121980",
        ],
      });
    }

    if (user.name && user.phone && user.cpf && user.birth_date) {
      return response.status(200).send({
        status: true,
        messages: [
          `Olá ${user.name}. Veja as opções que eu tenho para você e você digita o número da opção.`,
        ],
      });
    }

    return response.status(200).send({
      status: true,
      messages: [
        "Olá, me chamo Tony e sou seu assistente virtual que irá lhe ajudar. Antes de mais nada, verifiquei aqui que esse é seu primeiro contato conosco. Vou precisar de algumas informações para podermos continuar.",
      ],
    });

    // return response.status(200).send({
    //   status: true,
    //   messages: ["Não conseguimos compreender o que você indicou"],
    // });
  }
}

module.exports = WhatsappController;
