"use strict";

const Phone = use("App/Models/Phone");
const Chat = use("App/Models/Chat");
const Message = use("App/Models/Message");

class WhatsappController {
  async store({ response, request }) {
    const { phone, message } = request.all();
    const user = await Phone.query().where("phone", phone).first();
    const welcome = ["Olá", "ola", "oi", "ei", "Oi", "1", "2", "Ola"];
    const isnum = /^\d+$/.test(message);

    const chat = await Chat.query().where("phone", phone).first();

    if (chat) {
      const queryMessage = await Message.query()
        .where("chat_id", chat.id)
        .pickInverse();

      const lastMessage = queryMessage.first();

      // DATA DE NASCIMENTO
      if (
        lastMessage.message ===
          "Digite sua data de nascimento. Apenas números (dia, mês e ano). Por exemplo: 07121980" ||
        lastMessage.message ===
          "Digite a sua data de nascimento com apenas números. Por exemplo: 07121980" ||
        lastMessage.message ===
          "Por favor, insira sua data de nascimento com apenas números."
      ) {
        if (!isnum && message.length === 8) {
          await Message.create({
            message:
              "Digite a sua data de nascimento com apenas números. Por exemplo: 07121980",
            chat_id: chat.id,
          });

          return response.status(200).send({
            status: true,
            messages: ["Digite um CPF válido, contendo somente números."],
          });
        } else {
          if (isnum && message.length === 8) {
            if (user) {
              await Phone.query().where("phone", phone).update({
                birth_date: message,
              });
            } else {
              await Phone.create({
                phone,
                birth_date: message,
              });
            }

            await Message.create({
              message:
                "Legal, agora preciso do seu CPF. Apenas números, sem pontos ou traços.",
              chat_id: chat.id,
            });

            return response.status(200).send({
              status: true,
              messages: [
                "Legal, agora preciso do seu CPF. Apenas números, sem pontos ou traços.",
              ],
            });
          } else {
            await Message.create({
              message:
                "Por favor, insira sua data de nascimento com apenas números.",
              chat_id: chat.id,
            });

            return response.status(200).send({
              status: true,
              messages: [
                "Por favor, insira sua data de nascimento com apenas números.",
              ],
            });
          }
        }
      }

      // CPF
      if (
        lastMessage.message ===
          "Legal, agora preciso do seu CPF. Apenas números, sem pontos ou traços." ||
        lastMessage.message ===
          "Por favor, insira seu CPF somente com números, sem pontos ou traços."
      ) {
        if (!isnum && message.length === 11) {
          await Message.create({
            message: "Digite um CPF válido, contendo somente números.",
            chat_id: chat.id,
          });

          return response.status(200).send({
            status: true,
            messages: ["Digite um CPF válido, contendo somente números."],
          });
        } else {
          if (isnum && message.length === 11) {
            await Phone.query().where("phone", phone).update({
              cpf: message,
            });

            await Message.create({
              message:
                "Isso mesmo. Agora pra finalizar, como você gostaria que eu te chamasse.",
              chat_id: chat.id,
            });

            return response.status(200).send({
              status: true,
              messages: [
                "Isso mesmo. Agora pra finalizar, como você gostaria que eu te chamasse.",
              ],
            });
          } else {
            await Message.create({
              message:
                "Por favor, insira seu CPF válido somente com números, sem pontos ou traços.",
              chat_id: chat.id,
            });

            return response.status(200).send({
              status: true,
              messages: [
                "Por favor, insira seu CPF somente com números, sem pontos ou traços.",
              ],
            });
          }
        }
      }

      if (
        lastMessage.message ===
        "Isso mesmo. Agora pra finalizar, como você gostaria que eu te chamasse."
      ) {
        await Phone.query().where("phone", phone).update({
          name: message,
        });

        await Message.create({
          message: `Legal ${message}. Veja as opções que eu tenho para você e você digita o número da opção.`,
          chat_id: chat.id,
        });

        await Message.create({
          message: `*Saude*1. Quiz`,
          chat_id: chat.id,
        });

        return response.status(200).send({
          status: true,
          messages: [
            `Legal ${message}. Veja as opções que eu tenho para você e você digita o número da opção.`,
            "*Saude*1. Quiz",
          ],
        });
      }

      if (
        user &&
        user.phone &&
        user.name &&
        user.birth_date &&
        user.cpf &&
        lastMessage.message === "*Saude*1. Quiz" &&
        !isnum
      ) {
        await Message.create({
          message: `Legal ${user.name}. Veja as opções que eu tenho para você e você digita o número da opção.`,
          chat_id: chat.id,
        });

        await Message.create({
          message: `*Saude*1. Quiz`,
          chat_id: chat.id,
        });

        return response.status(200).send({
          status: true,
          messages: [
            `Legal ${user.name}. Veja as opções que eu tenho para você e você digita o número da opção.`,
            "*Saude*1. Quiz",
          ],
        });
      }

      // if (lastMessage.message === "*Saude*1. Quiz" && !isnum) {
      //   await Message.create({
      //     message: `Legal ${message}. Veja as opções que eu tenho para você e você digita o número da opção.`,
      //     chat_id: chat.id,
      //   });

      //   await Message.create({
      //     message: "*Saude*1. Quiz",
      //     chat_id: chat.id,
      //   });

      //   return response.status(200).send({
      //     status: true,
      //     messages: [
      //       `Legal ${user.name}. Veja as opções que eu tenho para você e você digita o número da opção.`,
      //       "*Saude*1. Quiz",
      //     ],
      //   });
      // }

      if (lastMessage.message === "*Saude*1. Quiz" && isnum) {
        if (message === "1") {
          await Message.create({
            message:
              "Você selecionou o 1. Quiz e vamos iniciar uma avaliação para saber como estar sua saúde.",
            chat_id: chat.id,
          });

          return response.status(200).send({
            status: true,
            messages: [
              `Você selecionou o 1. Quiz e vamos iniciar uma avaliação para saber como estar sua saúde.`,
            ],
          });
        } else {
          await Message.create({
            message: "Selecione um número das opções a seguir.",
            chat_id: chat.id,
          });

          await Message.create({
            message: "*Saude*1. Quiz",
            chat_id: chat.id,
          });

          return response.status(200).send({
            status: true,
            messages: [
              `Selecione um número das opções a seguir.`,
              "*Saude*1. Quiz",
            ],
          });
        }
      }
    } else {
      const chat = await Chat.create({
        phone,
        message: 0,
        status: true,
      });

      await Message.create({
        message:
          "Olá, me chamo Tony e sou seu assistente virtual que irá lhe ajudar. Antes de mais nada, verifiquei aqui que esse é seu primeiro contato conosco. Vou precisar de algumas informações para podermos continuar.",
        chat_id: chat.id,
      });

      await Message.create({
        message:
          "Digite sua data de nascimento. Apenas números (dia, mês e ano). Por exemplo: 07121980",
        chat_id: chat.id,
      });

      return response.status(200).send({
        status: true,
        messages: [
          "Olá, me chamo Tony e sou seu assistente virtual que irá lhe ajudar. Antes de mais nada, verifiquei aqui que esse é seu primeiro contato conosco. Vou precisar de algumas informações para podermos continuar.",
          "Digite sua data de nascimento. Apenas números (dia, mês e ano). Por exemplo: 07121980",
        ],
      });
    }

    // return response.status(200).send({
    //   status: true,
    //   messages: [
    //     "Olá, me chamo Tony e sou seu assistente virtual que irá lhe ajudar. Antes de mais nada, verifiquei aqui que esse é seu primeiro contato conosco. Vou precisar de algumas informações para podermos continuar.",
    //     "Digite sua data de nascimento. Apenas números (dia, mês e ano). Por exemplo: 07121980",
    //   ],
    // });

    // return response.status(200).send({
    //   status: true,
    //   messages: ["Não conseguimos compreender o que você indicou"],
    // });
  }
}

module.exports = WhatsappController;
