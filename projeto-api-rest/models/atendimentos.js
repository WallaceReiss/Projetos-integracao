const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class Atendimento {
    adiciona(atendimento, res) {
        const dataCriacao = new Date()
        // const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS')
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')

        const dataValida = moment(data).isSameOrAfter(dataCriacao);
        const clienteValido = atendimento.cliente.length >= 3;

        const validacoes = [
            {
                nome: 'data',
                valido: dataValida,
                mensagem: "Data deve ser maior ou igual a data atual"
            },

            {
                nome: "cliente",
                valido: clienteValido,
                mensagem: "Cliente deve conter ao menos 3 caracteres."
            }
        ]

        const erros = validacoes.filter(campo => !campo.valido);
        const existeErros = erros.length;
        // console.log(clienteValido)
        if (existeErros) {
            res.status(400).json(erros);
        } else {

            const atendimentoDatado = { ...atendimento, dataCriacao, data }

            const sql = `INSERT INTO atendimentos SET ?`

            conexao.query(sql, atendimentoDatado, (erro, resultados) => {
                if (erro) {
                    res.status(400).json(erro);
                } else {
                    res.status(201).json((atendimento))
                }
            })
        }


    }

    lista(res) {
        const sql = 'SELECT * FROM atendimentos '
        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultados)
            }
        })
    }

    buscaPorId(id, res) {
        const sql = `SELECT * FROM Atendimentos WHERE id=${id}`

        conexao.query(sql, (erro, resultados) => {
            const atendimento = resultados[0]
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(atendimento)
            }
        })
    }

    altera(id, valores, res) {
        if (valores.data) {
            valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
        }
        const sql = `UPDATE Atendimentos SET ? WHERE id=?`

        conexao.query(sql, [valores, id], (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json({ ...valores, id })
            }
        })
    }

    deleta(id, res) {
        const sql = `DELETE FROM Atendimentos WHERE id=?`

        conexao.query(sql, id, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json({ id })
            }
        })
    }
}

module.exports = new Atendimento;