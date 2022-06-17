$(document).ready(function() {
    const puissance4 = new Puissance4('#puissance4');
    $('#player').addClass(puissance4.joueur);
    puissance4.onJoueurMove = function() {
        $('#player').text(puissance4.joueur);
        $('#player').removeClass();
        $('#player').addClass(puissance4.joueur);
    };

    $('#restart, #reset').click(function() {
        puissance4.restart();
    });
});

class Puissance4 {
    constructor(selector) {
        this.LIGNES = 6;
        this.COLS = 7;
        this.joueur = 'Rouge';
        this.selector = selector;
        this.onJoueurMove = function() {};
        this.createGrille();
        this.setupEventListeners();
        this.ScoreRouge = 0;
        this.ScoreJaune = 0;
        this.NbParties = 1;
    }

    createGrille() {
        const $grille = $(this.selector);
        $grille.empty();
        this.joueur = 'Rouge';
        for (let ligne = 0; ligne < this.LIGNES; ligne++) {
            const $ligne = $('<div>').addClass('ligne', ligne);
            for (let col = 0; col < this.COLS; col++) {
                const $col = $('<div>')
                    .addClass('col vide')
                    .attr('data-col', col)
                    .attr('data-ligne', ligne);
                $ligne.append($col);
            }
            $grille.append($ligne);
        }
    }

    setupEventListeners() {
        const $grille = $(this.selector);
        const that = this;
        const lignes = this.LIGNES;
        const cols = this.COLS;
        let win = false;
        let egalite = false;

        function findLastEmptyCell(col) {
            const cells = $(`.col[data-col='${col}']`);
            for (let i = cells.length - 1; i >= 0; i--) {
                const $cell = $(cells[i]);
                if ($cell.hasClass('vide')) {
                    return $cell;
                }
            }
            return null;
        }

        $grille.on('mouseenter', '.col', function() {
            const col = $(this).data('col');
            const $lastEmptyCell = findLastEmptyCell(col);
            $lastEmptyCell.addClass(`next-${that.joueur}`);
        });

        $grille.on('mouseleave', '.col', function() {
            $('.col').removeClass(`next-Jaune`).removeClass(`next-Rouge`);
        });

        $grille.on('click', '.col.vide', function() {
            const col = $(this).data('col');
            const $lastEmptyCell = findLastEmptyCell(col);
            const firstCell = $(`.col[data-ligne='0'][data-col='${col}']`);

            $('.col').removeClass(`next-Jaune`).removeClass(`next-Rouge`);
            $("#jeton").css({"left": firstCell.position().left + 20, "top": firstCell.position().top + 20});
            $("#jeton").addClass(`col ${that.joueur}`);
            $("#jeton").animate({
                top : $lastEmptyCell.position().top +15
            }, function() {

                $("#jeton").removeClass(`col ${that.joueur}`);
                $lastEmptyCell.removeClass(`vide next-${that.joueur}`);
                $lastEmptyCell.addClass(that.joueur);
                $lastEmptyCell.data('joueur' + that.joueur);

                function checkWin() {
                    function checkH() {
                        for (let i = 0; i < lignes; i++) {
                            for (let j = 0; j < cols-3; j++) {
                                const cell = $(`.col[data-ligne='${i}'][data-col='${j}']`);
                                const cell2 = $(`.col[data-ligne='${i}'][data-col='${j+1}']`);
                                const cell3 = $(`.col[data-ligne='${i}'][data-col='${j+2}']`);
                                const cell4 = $(`.col[data-ligne='${i}'][data-col='${j+3}']`);
                                if(cell.hasClass(that.joueur) && cell2.hasClass(that.joueur) && cell3.hasClass(that.joueur) && cell4.hasClass(that.joueur)) {
                                    win = true;
                                    return win;
                                }
                            }
                        }
                    }
                    checkH();
                    function checkV() {
                        for (let j = 0; j < cols; j++) {
                            for (let i = 0; i < lignes-3; i++) {
                                const cell = $(`.col[data-ligne='${i}'][data-col='${j}']`);
                                const cell2 = $(`.col[data-ligne='${i+1}'][data-col='${j}']`);
                                const cell3 = $(`.col[data-ligne='${i+2}'][data-col='${j}']`);
                                const cell4 = $(`.col[data-ligne='${i+3}'][data-col='${j}']`);
                                if(cell.hasClass(that.joueur) && cell2.hasClass(that.joueur) && cell3.hasClass(that.joueur) && cell4.hasClass(that.joueur)) {
                                    win = true;
                                    return win;
                                }
                            }
                        }
                    }
                    checkV();
                    function checkDiagLD() {
                        for (let i = 3; i < lignes; i++) {
                            for (let j = 0; j < cols; j++) {
                                const cell = $(`.col[data-ligne='${i}'][data-col='${j}']`);
                                const cell2 = $(`.col[data-ligne='${i-1}'][data-col='${j+1}']`);
                                const cell3 = $(`.col[data-ligne='${i-2}'][data-col='${j+2}']`);
                                const cell4 = $(`.col[data-ligne='${i-3}'][data-col='${j+3}']`);
                                if(cell.hasClass(that.joueur) && cell2.hasClass(that.joueur) && cell3.hasClass(that.joueur) && cell4.hasClass(that.joueur)) {
                                    win = true;
                                    return win;
                                }
                            }
                        }
                    }
                    checkDiagLD();
                    function checkDiagDL() {
                        for (let i = 5; i > 0; i--) {
                            for (let j = 6; j > 0; j--) {
                                const cell = $(`.col[data-ligne='${i}'][data-col='${j}']`);
                                const cell2 = $(`.col[data-ligne='${i-1}'][data-col='${j-1}']`);
                                const cell3 = $(`.col[data-ligne='${i-2}'][data-col='${j-2}']`);
                                const cell4 = $(`.col[data-ligne='${i-3}'][data-col='${j-3}']`);
                                if(cell.hasClass(that.joueur) && cell2.hasClass(that.joueur) && cell3.hasClass(that.joueur) && cell4.hasClass(that.joueur)) {
                                    win = true;
                                    return win;
                                }
                            }
                        }
                    }
                    checkDiagDL();
                }
                checkWin();
                if(win) {
                    win = false;
                    $('h4').html("Victoire du Joueur <span class='"+ that.joueur +"'>" + that.joueur + "</span> !");
                    $('.col.vide').removeClass('vide');

                    if(that.joueur == "Rouge") {
                        that.ScoreRouge++;
                        $('#score').text(" " + that.ScoreRouge + " - " + that.ScoreJaune + " ");
                    } else {
                        that.ScoreJaune++;
                        $('#score').text(" " + that.ScoreRouge + " - " + that.ScoreJaune + " ");
                    }
                    $('#restart').clone().appendTo('#reset');
                    return;
                }

                function nul() {
                    let total = 0;
                    for (let i = 0; i < lignes; i++) {
                        for (let j = 0; j < cols; j++) {
                            const cell = $(`.col[data-ligne='${i}'][data-col='${j}']`);
                            if(cell.hasClass("Rouge") || cell.hasClass("Jaune")) {
                                total++;
                            }
                        }
                    }
                    if (total == 42) {
                        egalite = true;
                    }
                }
                nul();
                if (egalite) {
                    egalite = false;
                    $('h4').text("Match Nul !");
                    $('.col.vide').removeClass('vide');
                    $('#restart').clone().appendTo('#reset');
                    return;
                }

                that.joueur = that.joueur === 'Rouge' ? 'Jaune' : 'Rouge';
                that.onJoueurMove();
            })

        });

    }


    restart() {
        $("#reset").empty();
        this.createGrille();
        this.onJoueurMove();
        $('h4').empty();
        $('h4').append("C'est le tour du Joueur <span id=\"player\">Rouge</span>");
        this.NbParties++;
        $('h2').text("Partie n°" + this.NbParties);
        $('#player').addClass(this.joueur);
    }
}