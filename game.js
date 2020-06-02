console.log('[DevNatlima]');

let frames = 0;
const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

//plano de fundo
const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    width: 275,
    height: 204,
    x: 0,
    y: canvas.height - 204,
    desenha() {
        context.fillStyle = '#FFCBDB';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY, //sprite x e y dentro do arquivo
            planoDeFundo.width, planoDeFundo.height, //tamanho do recorte na sprite
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.width, planoDeFundo.height,
        );

        context.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY, //sprite x e y dentro do arquivo
            planoDeFundo.width, planoDeFundo.height, //tamanho do recorte na sprite
            (planoDeFundo.x + planoDeFundo.width), planoDeFundo.y,
            planoDeFundo.width, planoDeFundo.height,
        );
    }
};
//inicial
const mensagmGetReady = {
    spriteX: 134,
    spriteY: 0,
    width: 174,
    height: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenha() {
        context.drawImage(
            sprites,
            mensagmGetReady.spriteX, mensagmGetReady.spriteY, //sprite x e y dentro do arquivo
            mensagmGetReady.width, mensagmGetReady.height, //tamanho do recorte na sprite
            mensagmGetReady.x, mensagmGetReady.y,
            mensagmGetReady.width, mensagmGetReady.height,
        );
    }
};

//chão
function criaChao() {
    const chao = {
        spriteX: 0,
        spriteY: 610,
        width: 224,
        height: 112,
        x: 0,
        y: canvas.height - 112,
        atualiza() {
            const movChao = 1;
            const repete = chao.width / 2;
            const movi = chao.x - movChao;

            chao.x = movi % repete;


        },
        desenha() {
            context.drawImage(
                sprites,
                chao.spriteX, chao.spriteY, //sprite x e y dentro do arquivo
                chao.width, chao.height, //tamanho do recorte na sprite
                chao.x, chao.y,
                chao.width, chao.height,
            );

            context.drawImage(
                sprites,
                chao.spriteX, chao.spriteY, //sprite x e y dentro do arquivo
                chao.width, chao.height, //tamanho do recorte na sprite
                (chao.x + chao.width), chao.y,
                chao.width, chao.height,
            );
        },
    };
    return chao;
};

function desenhaFlappy() {
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        width: 33,
        height: 24,
        x: 10,
        y: 50,
        velocidade: 0,
        gravidade: 0.1,
        salta: 4,
        saltar() {
            console.log('antes', flappyBird.velocidade);
            flappyBird.velocidade = -flappyBird.salta;
            console.log('depois', flappyBird.velocidade);
        },

        atualiza() {
            if (fazColisao(flappyBird, globais.chao)) {
                console.log('perdeu');
                mudaDeTela(Telas.INICIO);
                return;
            }
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        movi: [
            { spriteX: 0, spriteY: 0, },
            { spriteX: 0, spriteY: 26, },
            { spriteX: 0, spriteY: 52, },
        ],
        frameAtual: 0,
        atuFrameAtual() {
            const intFrames = 10;
            const passInter = frames % intFrames === 0;
            if (passInter) {
                const incremento = 1;
                const incr = incremento + flappyBird.frameAtual;
                const baseRepe = flappyBird.movi.length;
                flappyBird.frameAtual = incr % baseRepe;
            }

        },
        desenha() {
            flappyBird.atuFrameAtual();
            const { spriteX, spriteY } = flappyBird.movi[flappyBird.frameAtual];

            context.drawImage(
                sprites,
                spriteX, spriteY, //sprite x e y dentro do arquivo
                flappyBird.width, flappyBird.height, //tamanho do recorte na sprite
                flappyBird.x, flappyBird.y,
                flappyBird.width, flappyBird.height,
            );
        }
    };
    return flappyBird;
};

function criaCanos() {
    const canos = {
        width: 52,
        height: 400,
        chao: {
            spriteX: 0,
            spriteY: 169,
        },
        ceu: {
            spriteX: 52,
            spriteY: 169,
        },
        espaco: 80,
        desenha() {
            canos.pares.forEach(function(par) {
                const randomY = par.y;
                const espacamento = 90;

                const canoCeuX = par.x;
                const canoCeuY = randomY;
                //cano do céu
                context.drawImage(
                    sprites,
                    canos.ceu.spriteX, canos.ceu.spriteY, //sprite x e y dentro do arquivo
                    canos.width, canos.height, //tamanho do recorte na sprite
                    canoCeuX, canoCeuY,
                    canos.width, canos.height,
                );
                //cano do chao
                const canoChaoX = par.x;
                const canoChaoY = canos.height + espacamento + randomY;

                context.drawImage(
                    sprites,
                    canos.chao.spriteX, canos.chao.spriteY, //sprite x e y dentro do arquivo
                    canos.width, canos.height, //tamanho do recorte na sprite
                    canoChaoX, canoChaoY,
                    canos.width, canos.height,
                );

                par.canoCeu = {
                        x: canoCeuX,
                        y: canos.height + canoCeuY
                    },
                    par.canoChao = {
                        x: canoChaoX,
                        y: canoChaoY
                    }
            });
        },
        fazColisaoComFlappy(par) {
            const cabecaFlappy = globais.flappyBird.y;
            const peFlappy = globais.flappyBird + globais.flappyBird.height;

            if (globais.flappyBird.x >= par.x) {

                if (cabecaFlappy <= par.canoCeu.y) {
                    return true;
                }

                if (peFlappy >= par.canoChao.y) {
                    return true;
                }
            }
            return false;
        },
        pares: [],
        atualiza() {
            const passouFrames = frames % 100 === 0;
            if (passouFrames) {
                canos.pares.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1),
                });
            }

            canos.pares.forEach(function(par) {
                par.x = par.x - 2;

                if (canos.fazColisaoComFlappy(par)) {
                    console.log('Não foi dessa vez!');
                    mudaDeTela(Telas.INICIO);
                }

                if (par.x + canos.width <= 0) {
                    canos.pares.shift();
                }
            });
        }
    }
    return canos;
};

function fazColisao(flappyBird, chao) {
    const flappyBirdY = flappyBird.y + flappyBird.height;
    const chaoY = chao.y;

    if (flappyBirdY >= chaoY) {
        return true;
    }
    return false;
};

//telas
const globais = {};
let telaAtiva = {};

function mudaDeTela(novaTela) {
    telaAtiva = novaTela;

    if (telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
}

const Telas = {
    INICIO: {
        inicializa() {
            globais.flappyBird = desenhaFlappy();
            globais.canos = criaCanos();
            globais.chao = criaChao();
        },
        desenha() {
            planoDeFundo.desenha();
            globais.flappyBird.desenha();
            globais.canos.desenha();
            globais.chao.desenha();
            mensagmGetReady.desenha();
        },
        click() {
            mudaDeTela(Telas.JOGO);
        },
        atualiza() {
            globais.chao.atualiza();
        }
    }
};

Telas.JOGO = {
    desenha() {
        planoDeFundo.desenha();
        globais.canos.desenha();
        globais.chao.desenha();
        globais.flappyBird.desenha();
    },
    click() {
        globais.flappyBird.saltar();
    },
    atualiza() {
        globais.canos.atualiza();
        globais.chao.atualiza();
        globais.flappyBird.atualiza();
    }
};

function loop() {
    telaAtiva.desenha();
    telaAtiva.atualiza();

    frames = frames + 1;
    requestAnimationFrame(loop); //desenha os quadros de forma infinita
};

window.addEventListener('click', function() {
    if (telaAtiva.click) {
        telaAtiva.click();
    }
});

mudaDeTela(Telas.INICIO);
loop();