$(document).ready(function() {
    $.ajax({
        type : 'GET',
        url : 'source.php?pre=1',
        dataType: 'json',
        success: function(data) {
            $sRouge = data.a;
            $sJaune = data.b;
            $nbParties = data.c;
            $enCours = data.d;
            $tableau = JSON.parse(data.t);
            $currentPlayer = data.p;

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
        }
    });
});

class Puissance4 {
    constructor(selector) {
        this.tab = $tableau;
        this.LIGNES = 6;
        this.COLS = 7;
        this.joueur = $currentPlayer;
        this.selector = selector;
        this.onJoueurMove = function() {};
        this.setupEventListeners();
        this.ScoreRouge = $sRouge;
        this.ScoreJaune = $sJaune;
        this.NbParties = $nbParties;
        this.enCours = $enCours;
        if (this.enCours == 0) {
            this.createGrille();
        } else {
            this.loadGrille();
        }
    }

    createGrille() {
        const $grille = $(this.selector);
        for(var i=0;i<6;i++) this.tab[i] = [];
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
                this.tab[ligne][col] = 'empty';
                $.ajax({
                    type : 'POST',
                    url : 'source.php?tab',
                    data: {"tab" :JSON.stringify(this.tab)},
                    dataType: 'json',
                });

            }
            $grille.append($ligne);
            $.ajax({
                type : 'POST',
                url : 'source.php?currentPlayer',
                data: {"currentPlayer" : this.joueur},
                dataType: 'json',
            });
        }

        if (this.enCours == 0) {
            this.NbParties++;
            this.enCours = 1;
            $.ajax({
                type : 'POST',
                url : 'source.php?encours',
                data: {"encours" : this.enCours},
                dataType: 'json',
            });

            $.ajax({
                type : 'POST',
                url : 'source.php?updateParties',
                data: {"updateParties" : this.NbParties},
                dataType: 'json',
            });
        }

        $('#score').text(" " + this.ScoreRouge + " - " + this.ScoreJaune + " ");
        $('#nb_games').text("Partie n°"+this.NbParties);
    }

    loadGrille(){
        const $grille = $(this.selector);
        $grille.empty();
        for (let ligne = 0; ligne < this.tab.length; ligne++) {
            const $ligne = $('<div>').addClass('ligne', ligne);
            for (let col = 0; col < this.tab[ligne].length; col++) {
                if(this.tab[ligne][col] == "Rouge") {
                const $col = $('<div>')
                    .addClass('col Rouge')
                    .attr('data-col', col)
                    .attr('data-ligne', ligne);
                $ligne.append($col);
                } else if(this.tab[ligne][col] == "Jaune") {
                    const $col = $('<div>')
                        .addClass('col Jaune')
                        .attr('data-col', col)
                        .attr('data-ligne', ligne);
                    $ligne.append($col);
                } else {
                    const $col = $('<div>')
                        .addClass('col vide')
                        .attr('data-col', col)
                        .attr('data-ligne', ligne);
                    $ligne.append($col);
                }
            $grille.append($ligne);
            }
        }
        $('#player').text(this.joueur);
        $('#score').text(" " + this.ScoreRouge + " - " + this.ScoreJaune + " ");
        $('#nb_games').text("Partie n°"+this.NbParties);
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
            const i = $lastEmptyCell.attr('data-ligne');
            const j = $lastEmptyCell.attr('data-col');
            that.tab[i][j] = that.joueur;
            $.ajax({
                type : 'POST',
                url : 'source.php?tab',
                data: {"tab" : JSON.stringify(that.tab)},

            });
            console.log(that.tab);
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
                                    cell.addClass('jw');
                                    cell2.addClass('jw');
                                    cell3.addClass('jw');
                                    cell4.addClass('jw');
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
                                    cell.addClass('jw');
                                    cell2.addClass('jw');
                                    cell3.addClass('jw');
                                    cell4.addClass('jw');
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
                                    cell.addClass('jw');
                                    cell2.addClass('jw');
                                    cell3.addClass('jw');
                                    cell4.addClass('jw');
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
                                    cell.addClass('jw');
                                    cell2.addClass('jw');
                                    cell3.addClass('jw');
                                    cell4.addClass('jw');
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

                    that.enCours = 0;
                    console.log(that.enCours);
                    $.ajax({
                        type : 'POST',
                        url : 'source.php?encours',
                        data: {"encours" : that.enCours},
                        dataType: 'json',
                    });

                    win = false;
                    $('h4').html("Victoire du Joueur <span class='"+ that.joueur +"'>" + that.joueur + "</span> !");
                    $('.col.vide').removeClass('vide');

                    if(that.joueur == "Rouge") {
                        that.ScoreRouge++;
                        $('#score').text(" " + that.ScoreRouge + " - " + that.ScoreJaune + " ");
                        $.ajax({
                            type : 'POST',
                            url : 'source.php?scoreR',
                            data: {"scoresR" : that.ScoreRouge},
                            dataType: 'json',
                        });
                    } else {
                        that.ScoreJaune++;
                        $('#score').text(" " + that.ScoreRouge + " - " + that.ScoreJaune + " ");
                        $.ajax({
                            type : 'POST',
                            url : 'source.php?scoreJ',
                            data: {"scoresJ" : that.ScoreJaune},
                            dataType: 'json',
                        });
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
                $lastEmptyCell.addClass(`next-${that.joueur}`);
                that.joueur = that.joueur === 'Rouge' ? 'Jaune' : 'Rouge';
                that.onJoueurMove();
                $.ajax({
                    type : 'POST',
                    url : 'source.php?currentPlayer',
                    data: {"currentPlayer" : that.joueur},
                    dataType: 'json',
                });
            })

        });

    }


    restart() {
        $("#reset").empty();
        this.enCours = 1;
        console.log(this.enCours);
        $.ajax({
            type : 'POST',
            url : 'source.php?encours',
            data: {"encours" : this.enCours},
            dataType: 'json',
        });
        this.createGrille();
        this.onJoueurMove();
        $('h4').empty();
        $('h4').append("C'est au tour du Joueur <span id=\"player\">Rouge</span>");
        this.NbParties++;
        $('h2').text("Partie n°" + this.NbParties);
        $.ajax({
            type : 'POST',
            url : 'source.php?updateParties',
            data: {"updateParties" : this.NbParties},
            dataType: 'json',
        });
        $('#player').addClass(this.joueur);
    }
}