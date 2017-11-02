$(document).ready(function () {

    let puzzleSection = $("#puzzlearea").children();
    let emptyslot = [300, 300];
    let images = ['Batman', 'Green Lantern', 'Spiderman', 'Superman', 'Wolverine'];
    let scale_x = 0, scale_y = 0, scale_left = 0, scale_top = 0;
    let shuffing = false;
    let freeze = false;
    let image_choice = images[Math.floor(Math.random() * 5)];

    function setup(path) {
        $(".victory").remove();

        scale_x = 0;
        scale_y = 0;
        scale_left = 0;
        scale_top = 0;
        emptyslot[0] = 300;
        emptyslot[1] = 300;

        //iteratively change the background image and position on each tile
        for (let piece of puzzleSection) {
            piece.style.backgroundImage = 'url("images/' + path + '.jpg")';

            piece.style.backgroundPosition = String(scale_x) + 'px ' + String(scale_y) + 'px';
            piece.style.left = String(scale_left) + 'px ';
            piece.style.top = String(scale_top) + 'px ';

            if (scale_x === -300) {
                scale_x = 100;
                scale_y -= 100;
            }
            if (scale_left === 300) {
                scale_left = -100;
                scale_top += 100;
            }
            scale_x -= 100;
            scale_left += 100;
        }
        $("#shufflebutton").trigger("click");
    }


    for (let piece of puzzleSection) {
        piece.classList.add("puzzlepiece");
        piece.id = piece.innerHTML;

        piece.style.backgroundImage = 'url("images/' + image_choice + '.jpg")';

        piece.style.backgroundPosition = String(scale_x) + 'px ' + String(scale_y) + 'px';
        piece.style.left = String(scale_left) + 'px ';
        piece.style.top = String(scale_top) + 'px ';

        if (scale_x === -300) {
            scale_x = 100;
            scale_y -= 100;
        }
        if (scale_left === 300) {
            scale_left = -100;
            scale_top += 100;
        }
        scale_x -= 100;
        scale_left += 100;
    }


    $("#overall").before("<div align='center'><button style='margin: 5px;' class='bgImage'>Batman</button>" +
        "<button style='margin: 5px;' class='bgImage'>Green Lantern</button>" +
        "<button style='margin: 5px;' class='bgImage'>Superman</button>" +
        "<button style='margin: 5px;' class='bgImage'>Spiderman</button>" +
        "<button style='margin: 5px;' class='bgImage'>Wolverine</button></div>");


    $(".bgImage").click(function () {
        setup(this.innerHTML); // changes the puzzle image
    });

    $(".puzzlepiece").mouseenter(function () {
        if (freeze) {
            return;
        }
        let location_left = parseInt(this.style.left.slice(0, -2));
        let location_top = parseInt(this.style.top.slice(0, -2));

        let top_free = true, bottom_free = true, left_free = true, right_free = true;

        /*Checks to see if the tile is located near the boundaries of the puzzle*/
        if (location_left === 300) {
            right_free = false;
        }
        if (location_left === 0) {
            left_free = false;
        }
        if (location_top === 0) {
            top_free = false;
        }
        if (location_top === 300) {
            bottom_free = false;
        }

        //iteratively search for tiles that are close by that are in the assumed free slots, and mark the slots
        //as no longer being free to move the tile
        for (let piece of puzzleSection) {
            let check = piece.style;
            let top_area = parseInt(check.top.slice(0, -2));
            let left_area = parseInt(check.left.slice(0, -2));

            if (top_free && top_area === location_top - 100 && left_area === location_left) {
                top_free = false;
            }
            if (right_free && top_area === location_top && left_area === location_left + 100) {
                right_free = false;
            }
            if (bottom_free && top_area === location_top + 100 && left_area === location_left) {
                bottom_free = false;
            }
            if (left_free && top_area === location_top && left_area === location_left - 100) {
                left_free = false;
            }
        }

        //checks if the tile is movable
        if (top_free || bottom_free || left_free || right_free) {
            this.classList.add("movablepiece");
        }

    });

    $(".puzzlepiece").mouseleave(function () {
        this.classList.remove("movablepiece");
    });

    $(".puzzlepiece").click(function () {

        //checks if the game has been frozen and dont move a tile if its true
        if (freeze) {
            return;
        }

        let location_left = parseInt(this.style.left.slice(0, -2));
        let location_top = parseInt(this.style.top.slice(0, -2));

        let top_free = true, bottom_free = true, left_free = true, right_free = true;
        let won = true;
        scale_top = 0;
        scale_left = 0;

        /*Checks to see if the tile is located near the puzzle boundary*/
        if (location_left === 300) {
            right_free = false;
        }
        if (location_left === 0) {
            left_free = false;
        }
        if (location_top === 0) {
            top_free = false;
        }
        if (location_top === 300) {
            bottom_free = false;
        }

        //iteratively searches for tiles that matches the assumed free areas to move, and mark the areas
        //as no longer being free
        for (let piece of puzzleSection) {
            let check = piece.style;
            let top_area = parseInt(check.top.slice(0, -2));
            let left_area = parseInt(check.left.slice(0, -2));


            if (top_free && top_area === location_top - 100 && left_area === location_left) {
                top_free = false;
            }
            if (right_free && top_area === location_top && left_area === location_left + 100) {
                right_free = false;
            }
            if (bottom_free && top_area === location_top + 100 && left_area === location_left) {
                bottom_free = false;
            }
            if (left_free && top_area === location_top && left_area === location_left - 100) {
                left_free = false;
            }

        }

        /*Checks for the free slot to move the tile and make note of where the new free slot will be,
        * as well as move the tile*/
        if (top_free) {
            this.style.top = (location_top - 100) + 'px';
            emptyslot[0] = location_left;
            emptyslot[1] = location_top;

        } else if (bottom_free) {
            this.style.top = (location_top + 100) + 'px';
            emptyslot[0] = location_left;
            emptyslot[1] = location_top;
        } else if (left_free) {
            this.style.left = (location_left - 100) + 'px';
            emptyslot[0] = location_left;
            emptyslot[1] = location_top;
        } else if (right_free) {
            this.style.left = (location_left + 100) + 'px';
            emptyslot[0] = location_left;
            emptyslot[1] = location_top;
        }

        //searches to check if the tiles are in order to determine if the user won
        for (let piece of puzzleSection) {
            if (parseInt(piece.style.top.slice(0, -2)) !== scale_top || parseInt(piece.style.left.slice(0, -2)) !== scale_left) {
                won = false;
            }
            if (scale_left === 300) {
                scale_left = -100;
                scale_top += 100;
            }
            scale_left += 100;
        }

        //checks if the user won, and it wasn't a random win due to shuffing
        if (won && !shuffing) {
            $("#overall").before("<h1 class='victory' style='color: #006600; text-align: center;'>You Won!!</h1>");
            freeze = true; //freezes tiles that they cant move
        }


    });

    $("#shufflebutton").click(function () {

        //removes the victory heading if it exists
        $(".victory").remove();

        //indicates that shuffing is occurring
        shuffing = true;

        //allows tiles to move
        freeze = false;

        //shuffle tiles inplace on the board 100 times
        for (let i = 0; i < 100; i++) {

            //checks to see if the empty slot is in the center of the puzzle
            if (emptyslot[0] > 0 && emptyslot[0] < 300 && emptyslot[1] > 0 && emptyslot[1] < 300) {
                let location = Math.floor(Math.random() * 4) + 1; // find the tile to move to empty slot

                //moves the tile above to the empty slot
                if (location === 1) {

                    //search for the tile and trigger its click event to move the tile
                    for (let piece of puzzleSection) {
                        let piece_info = piece.style;

                        if (parseInt(piece_info.top.slice(0, -2)) === emptyslot[1] - 100 &&
                            parseInt(piece_info.left.slice(0, -2)) === emptyslot[0]) {

                            $("#" + piece.id).trigger("click");
                        }
                    }
                }
                //moves the tile to the right to the empty slot
                else if (location === 2) {

                    //search for the tile and trigger its click event to move the tile
                    for (let piece of puzzleSection) {
                        let piece_info = piece.style;


                        if (parseInt(piece_info.top.slice(0, -2)) === emptyslot[1] &&
                            parseInt(piece_info.left.slice(0, -2)) === emptyslot[0] + 100) {

                            $("#" + piece.id).trigger("click");
                        }
                    }
                }
                //moves the tile to the bottom to the empty slot
                else if (location === 3) {

                    //search for the tile and trigger its click event to move the tile
                    for (let piece of puzzleSection) {
                        let piece_info = piece.style;

                        if (parseInt(piece_info.top.slice(0, -2)) === emptyslot[1] + 100 && parseInt(piece_info.left.slice(0, -2)) === emptyslot[0]) {

                            $("#" + piece.id).trigger("click");
                        }
                    }
                }
                //moves the tile to the left to the empty slot
                else if (location === 4) {

                    //search for the tile and trigger its click event to move the tile
                    for (let piece of puzzleSection) {
                        let piece_info = piece.style;

                        if (parseInt(piece_info.top.slice(0, -2)) === emptyslot[1] && parseInt(piece_info.left.slice(0, -2)) === emptyslot[0] - 100) {

                            $("#" + piece.id).trigger("click");
                        }
                    }
                }

            }
            //checks to see if the empty slot is along the leftmost column of the puzzle
            else if (emptyslot[0] === 0) {
                let location = Math.floor(Math.random() * 3) + 1; // find the tile to move to empty slot

                //moves the tile to the top to the empty slot
                if (location === 1) {
                    for (let piece of puzzleSection) {
                        let piece_info = piece.style;

                        if (parseInt(piece_info.top.slice(0, -2)) === emptyslot[1] - 100 && parseInt(piece_info.left.slice(0, -2)) === emptyslot[0]) {

                            $("#" + piece.id).trigger("click");
                        }
                    }
                }
                //moves the tile to the right to the empty slot
                else if (location === 2) {
                    for (let piece of puzzleSection) {
                        let piece_info = piece.style;

                        if (parseInt(piece_info.top.slice(0, -2)) === emptyslot[1] && parseInt(piece_info.left.slice(0, -2)) === emptyslot[0] + 100) {

                            $("#" + piece.id).trigger("click");
                        }
                    }
                }
                //moves the tile to the bottom to the empty slot
                else if (location === 3) {
                    for (let piece of puzzleSection) {
                        let piece_info = piece.style;

                        if (parseInt(piece_info.top.slice(0, -2)) === emptyslot[1] + 100 && parseInt(piece_info.left.slice(0, -2)) === emptyslot[0]) {

                            $("#" + piece.id).trigger("click");
                        }
                    }
                }
            }
            //checks to see if the empty slot is along the rightmost column of the puzzle
            else if (emptyslot[0] === 300) {
                let location = Math.floor(Math.random() * 3) + 1;// find the tile to move to empty slot

                //moves the tile to the top to the empty slot
                if (location === 1) {
                    for (let piece of puzzleSection) {
                        let piece_info = piece.style;

                        if (parseInt(piece_info.top.slice(0, -2)) === emptyslot[1] - 100 && parseInt(piece_info.left.slice(0, -2)) === emptyslot[0]) {

                            $("#" + piece.id).trigger("click");
                        }
                    }
                }
                //moves the tile to the left to the empty slot
                else if (location === 2) {
                    for (let piece of puzzleSection) {
                        let piece_info = piece.style;

                        if (parseInt(piece_info.top.slice(0, -2)) === emptyslot[1] && parseInt(piece_info.left.slice(0, -2)) === emptyslot[0] - 100) {

                            $("#" + piece.id).trigger("click");
                        }
                    }
                }
                //moves the tile to the bottom to the empty slot
                else if (location === 3) {
                    for (let piece of puzzleSection) {
                        let piece_info = piece.style;

                        if (parseInt(piece_info.top.slice(0, -2)) === emptyslot[1] + 100 && parseInt(piece_info.left.slice(0, -2)) === emptyslot[0]) {

                            $("#" + piece.id).trigger("click");
                        }
                    }
                }
            }
            //checks to see if the empty slot is along the top row of the puzzle
            else if (emptyslot[1] === 0) {
                let location = Math.floor(Math.random() * 3) + 1;

                //moves the tile to the left to the empty slot
                if (location === 1) {
                    for (let piece of puzzleSection) {
                        let piece_info = piece.style;

                        if (parseInt(piece_info.top.slice(0, -2)) === emptyslot[1] && parseInt(piece_info.left.slice(0, -2)) === emptyslot[0] - 100) {

                            $("#" + piece.id).trigger("click");
                        }
                    }
                }
                //moves the tile to the right to the empty slot
                else if (location === 2) {
                    for (let piece of puzzleSection) {
                        let piece_info = piece.style;

                        if (parseInt(piece_info.top.slice(0, -2)) === emptyslot[1] && parseInt(piece_info.left.slice(0, -2)) === emptyslot[0] + 100) {

                            $("#" + piece.id).trigger("click");
                        }
                    }
                }
                //moves the tile to the bottom to the empty slot
                else if (location === 3) {
                    for (let piece of puzzleSection) {
                        let piece_info = piece.style;

                        if (parseInt(piece_info.top.slice(0, -2)) === emptyslot[1] + 100 && parseInt(piece_info.left.slice(0, -2)) === emptyslot[0]) {

                            $("#" + piece.id).trigger("click");
                        }
                    }
                }
            }
            //checks to see if the empty slot is along the bottom row of the puzzle
            else if (emptyslot[1] === 300) {
                let location = Math.floor(Math.random() * 3) + 1;

                //moves the tile to the top to the empty slot
                if (location === 1) {
                    for (let piece of puzzleSection) {
                        let piece_info = piece.style;

                        if (parseInt(piece_info.top.slice(0, -2)) === emptyslot[1] - 100 && parseInt(piece_info.left.slice(0, -2)) === emptyslot[0]) {

                            $("#" + piece.id).trigger("click");
                        }
                    }
                }
                //moves the tile to the right to the empty slot
                else if (location === 2) {
                    for (let piece of puzzleSection) {
                        let piece_info = piece.style;

                        if (parseInt(piece_info.top.slice(0, -2)) === emptyslot[1] && parseInt(piece_info.left.slice(0, -2)) === emptyslot[0] + 100) {

                            $("#" + piece.id).trigger("click");
                        }
                    }
                }
                //moves the tile to the left to the empty slot
                else if (location === 3) {
                    for (let piece of puzzleSection) {
                        let piece_info = piece.style;

                        if (parseInt(piece_info.top.slice(0, -2)) === emptyslot[1] && parseInt(piece_info.left.slice(0, -2)) === emptyslot[0] - 100) {

                            $("#" + piece.id).trigger("click");
                        }
                    }
                }
            }
        }
        shuffing = false;
    });

    $("#shufflebutton").trigger("click"); //triggers the puzzle to be shuffled on page load
});
