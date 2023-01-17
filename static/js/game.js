var pontos = 0;
var bonus = 5;
var acertos = 0;
var debito = 0;
var erros = 0;
var clique = [];
var mapa = [];
var seg = 0;

// - Lógica do jogo
function game(jogada){
    // - Carrega os icones.
    var num = jogada.replace('#btn', '')
    $(jogada).html(subIcon(mapa[num]));
    clique.push(num);

    // - Botão Azul e Desativado.
    subEDButtons(jogada, 'addClassPrimary');
    subEDButtons(jogada, 'addClassDisabled');

    // - Primeiro clique: retorna.
    if (clique.length == 1){
      //console.log('botão da tela - ' + clique[0]);
      //console.log('item icone - ' + mapa[clique[0]]);
      return;
    }

    // - Segundo clique: Acerto.
    if (mapa[clique[0]] == mapa[clique[1]]){
      if (erros > 0){
        bonus = 1;
        gameBonus(bonus);
      }

      // - Atualiza a barra de progresso a fase.
      acertos += 1;
      pontos += 1 * bonus;
      $('#gameProgresso').progress('increment');

      // - Botões de acerto verde e desabilitado, reseta cliques.
      subEDButtons('#btn'+clique[0], 'addClassDisabled');
      subEDButtons('#btn'+clique[0], 'addClassPositive');

      subEDButtons('#btn'+clique[1], 'addClassDisabled');
      subEDButtons('#btn'+clique[1], 'addClassPositive');

      subEDButtons(null, 'resetClique');
    
    // - Segundo clique: Erro.
    }else{
      // - Acrescenta penalidades avaliando os pontos e retorna o padrão dos botões.
      erros += 1;
      bonus = 1;
      gameBonus(bonus);

      subEDButtons('#btn'+clique[0], 'removeClassDisable');
      subEDButtons('#btn'+clique[0], 'removeClassPrimary');
      subEDButtons('#btn'+clique[0], 'addHtmlIconHuge');

      subEDButtons('#btn'+clique[1], 'removeClassDisable');
      subEDButtons('#btn'+clique[1], 'removeClassPrimary');
      subEDButtons('#btn'+clique[1], 'addHtmlIconHuge');

      subEDButtons(null, 'resetClique');

      if (pontos > 50 && pontos < 100){
        pontos -= debito;
      }else if (pontos >= 100 && pontos < 150){
        debito = 2;
        pontos -= debito;
      }
    }

    // - Atualiza a pontuação do front-end
    $('#pontos').html(parseInt(pontos));
}

// - Atualiza o bônus de pontos e front-end.
function gameBonus(bn){
    switch (bn) {
      case 1:
        $('#gameBonus').html('');
        break;
      case 2:
        $('#gameBonus').html('<i class="circular star icon link" data-tooltip="Bônus de 2x" data-position="right center"><i class="smile outline icon"></i></i>');
        break;
      case 3:
        $('#gameBonus').html('<i class="circular star icon link" data-tooltip="Bônus de 3x" data-position="right center"><i class="smile outline icon"></i></i>');
        break;
      case 4:
        $('#gameBonus').html('<i class="circular star icon link" data-tooltip="Bônus de 4x" data-position="right center"><i class="smile outline icon"></i></i>');
        break;
      case 5:
        $('#gameBonus').html('<i class="circular star icon link" data-tooltip="Bônus de 5x" data-position="right center"><i class="smile outline icon"></i></i>');
        break;
    
      default:
        bonus = bn;
        break;
    }
}

// - Inicializa nova fase ou um jogo novo.
function iniciar(nf){
    if (nf == 'novo_jogo'){
      seg = 1;
      subRelogio(nf);
    }else if (nf == 'nova_fase'){
      seg = 1;
      subRelogio(nf);
    }else if (nf == 'mostrar_fase'){
      if (pontos < 50){
        seg = 4;
        bonus = 5;
        debito = 0;
        gameBonus(bonus);
      }else if (pontos > 50 && pontos < 100){
        seg = 3;
        bonus = 2;
        debito = 1;
        gameBonus(bonus);
      }else if (pontos >= 100 && pontos < 150){
        seg = 3;
        bonus = 1;
        debito = 2;
        gameBonus(bonus);
      }else{
        seg = 2;
        bonus = 1;
        debito = 2;
        gameBonus(bonus);
      }
      if (acertos == 6){
        bonus;
        gameBonus(bonus);
      }else if (acertos > 0){
        bonus = 1;
        gameBonus(bonus);
      }
      acertos = 0;
      subRelogio(nf);
    }
}

// - Criador de fase aleatória.
function novaFase(){
    // - Escolhe 6 icones aleatórios entre 10 tipos, duplica-os em um vetor do mapa.
    var icone;
    while (mapa.length < 11){
      icone = Math.floor(Math.random() * 10);
      if (mapa.indexOf(icone) == -1){
        mapa.push(icone, icone);
      }
    }
    
    // - Permutar vetor do mapa.
    shuffle(mapa);

    function shuffle(array) {
      var m = array.length, t, i;
      while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
      }
      return array;
    }
}

// - Reinicia front-end.
function resetGame(tp){
    switch (tp){
      case 'novo_jogo':
        // - Limpar variáveis.
        pontos = 0;
        erros = 0;
        acertos = 0;
        $('#pontos').html(parseInt(pontos));
        subEDButtons(null, 'resetClique');
        $('#gameProgresso').progress('reset');

        // - Padrão dos botões.
        subEDButtons(null, 'allAddClassDisable');
        subEDButtons(null, 'allAddHtmlIconHuge');
        subEDButtons(null, 'allRemoveClassPP');

        // - Padrão botões do rodapé.
        $('#btnNovaFase').html('<i class="caret right icon"></i> Nova fase');

      case 'nova_fase':
        // - Limpar variáveis.
        erros = 0;
        subEDButtons(null, 'resetClique');
        $('#gameProgresso').progress('reset');

        // - Padrão dos botões.
        subEDButtons(null, 'allAddClassDisable');
        subEDButtons(null, 'allAddHtmlIconHuge');
        subEDButtons(null, 'allRemoveClassPP');

        // - Padrão botões do rodapé.
        $("#btnExtra").show();
        break;
      case 'total':
        // - Limpar variáveis.
        pontos = 0;
        erros = 0;
        acertos = 0;
        $('#pontos').html(parseInt(pontos));
        subEDButtons(null, 'resetClique');
        $('#gameProgresso').progress('reset');

        // - Padrão dos botões.
        subEDButtons(null, 'allAddClassDisable');
        subEDButtons(null, 'allAddHtmlIconHuge');
        subEDButtons(null, 'allRemoveClassPP');

        // - Padrão botões do rodapé.
        $("#btnExtra").hide();
        $('#btnNovaFase').html('<i class="caret right icon"></i> Nova fase');
        $("#btnComecar").show();
        $('#btnComecar').html('<i class="caret right icon"></i> Começar');
        break;
    }
}

// - Lista de icones.
function subIcon(ic){
    switch (ic){
      case 0:
        return '<i class="huge headphones icon"></i>';
        break;
      case 1:
        return '<i class="huge rss square icon"></i>';
        break;
      case 2:
        return '<i class="huge music icon"></i>';
        break;
      case 3:
        return '<i class="huge video icon"></i>';
        break;
      case 4:
        return '<i class="huge bullhorn icon"></i>';
        break;
      case 5:
        return '<i class="huge coffee icon"></i>';
        break;
      case 6:
        return '<i class="huge calculator icon"></i>';
        break;
      case 7:
        return '<i class="huge book icon"></i>';
        break;
      case 8:
        return '<i class="huge suitcase icon"></i>';
        break;
      case 9:
        return '<i class="huge save icon"></i>';
        break;
      case 10:
        return '<i class="huge chess rook icon"></i>';
        break;
      case 11:
        return '<i class="huge microchip icon"></i>';
        break;
    }
}

// - Timer
function subRelogio(control){	
    switch (control){
      case 'novo_jogo':
        if (seg > 0){
          seg = seg - 1;
          $('#btnComecar').html('<i class="loading spinner icon"></i>Carregando...');
          setTimeout('subRelogio("novo_jogo")', 1000);
        }else if (seg == 0){
          resetGame('novo_jogo');
          novaFase();
          $("#btnComecar").hide();
          $('#btnComecar').html('<i class="caret right icon"></i> Começar');
          iniciar('mostrar_fase');
          $("#btnExtra").show();
        }
        break;
      case 'nova_fase':
        if (seg > 0){
          seg = seg - 1;
          $('#btnNovaFase').html('<i class="loading spinner icon"></i>Carregando...');
          setTimeout('subRelogio("nova_fase")', 1000);
        }else if (seg == 0){
          resetGame('nova_fase');
          novaFase();
          $('#btnNovaFase').html('<i class="caret right icon"></i> Nova fase');
          iniciar('mostrar_fase');
        }
        break;
      case 'mostrar_fase':
        if (seg > 0){
          // - Mostra fase e desabilita os botoes.
          subEDButtons(null, 'allAddIconsButtons')
          subEDButtons(null, 'allAddClassDisable')

          seg = seg - 1;
          setTimeout('subRelogio("mostrar_fase")', 1000);
        }else if (seg == 0){
          // - Ocultar fase e habilita os botoes.
          subEDButtons(null, 'allAddHtmlIconHuge')
          subEDButtons(null, 'allRemoveClassDisable')
        }
        break;
    }
}

// - Controlador dos Botões.
function subEDButtons(obj, func){
    switch (func){
      case 'addClassDisabled':
        $(obj).addClass('disabled');
        break;
      case 'removeClassDisable':
        $(obj).removeClass('disabled');
        break;
      case 'addClassPrimary':
        $(obj).addClass('primary');
        break;
      case 'removeClassPrimary':
        $(obj).removeClass('primary');
        break;
      case 'addClassPositive':
        $(obj).addClass('positive');
        break;
      case 'removeClassPositive':
        $(obj).removeClass('positive');
        break;
      case 'addHtmlIconHuge':
        $(obj).html('<i class="huge icon"></i>');
        break;
      case 'allRemoveClassDisable':
        $('#btns button').each(function(index, element){ 
          $(element).removeClass('disabled');
        });
        break;
      case 'allAddClassDisable':
        $('#btns button').each(function(index, element){ 
          $(element).addClass('disabled');
        });
        break;
      case 'allAddHtmlIconHuge':
        $('#btns button').each(function(index, element){ 
          $(element).html('<i class="huge icon"></i>');
        });
        break;
      case 'allAddIconsButtons':
        $('#btns button').each(function(index, element){ 
          $(element).html(subIcon(mapa[index]));
        });
        break;
      case 'allRemoveClassPP':            
        $('#btns button').each(function(index, element){ 
          $(element).removeClass('primary');
          $(element).removeClass('positive');
        });
        break;
      case 'resetClique':            
        while(clique.length) {
          clique.pop();
        }
        break;
    }
}