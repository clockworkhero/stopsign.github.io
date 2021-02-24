
let view = {
    update: function() {
        view.updateResourcesDisplays();
    },
    updateResourcesDisplays: function() {
        document.getElementById("science").innerHTML = data.science;

        let thePlanet = data.systems[data.curSystem].planets[data.curPlanet];
        document.getElementById("workers").innerHTML = thePlanet.workers;
        document.getElementById("workersTotal").innerHTML = Math.floor(thePlanet.pop + thePlanet.vPop + .0000001);
        document.getElementById("pop").innerHTML = intToString(thePlanet.pop);
        document.getElementById("popDelta").innerHTML = intToStringNegative(thePlanet.popD, 5);
        document.getElementById("popTotal").innerHTML = intToString(thePlanet.popTotal);
        document.getElementById("vPop").innerHTML = intToString(thePlanet.vPop);
        document.getElementById("vPopDelta").innerHTML = intToStringNegative(thePlanet.vPopD, 5);
        document.getElementById("vPopTotal").innerHTML = intToString(thePlanet.vPopTotal);
        document.getElementById("ore").innerHTML = intToString(thePlanet.ore);
        document.getElementById("oreDelta").innerHTML = intToStringNegative(thePlanet.oreD);
        document.getElementById("electronics").innerHTML = intToString(thePlanet.electronics);
        document.getElementById("electronicsDelta").innerHTML = intToStringNegative(thePlanet.electronicsD);
        document.getElementById("panels").innerHTML = intToString(thePlanet.panels);
        document.getElementById("panelsDelta").innerHTML = intToStringNegative(thePlanet.panelsD);
        document.getElementById("sails").innerHTML = intToString(thePlanet.sails);
        document.getElementById("sailsDelta").innerHTML = intToStringNegative(thePlanet.sailsD);
        document.getElementById("science").innerHTML = intToString(data.science);
        document.getElementById("scienceDelta").innerHTML = intToStringNegative(data.scienceD);
        document.getElementById("electricityUsed").innerHTML = thePlanet.powerReq;
        document.getElementById("electricityGain").innerHTML = thePlanet.powerGain;
    },
    changePlanets: function() { //initializes solar system, planet grid
        let planetGrid = data.systems[data.curSystem].planets[data.curPlanet].grid;
        for(let col = 0 ; col < planetGrid.length; col++) {
            for (let row = 0; row < planetGrid[col].length; row++) {

                let elem = document.createElement("div");
                let rowSize = 50;
                let rectStartX = col * rowSize;
                let rectStartY = row * rowSize;
                elem.innerHTML =
                    "<div class='gridCell' style='left:" + rectStartX + "px;top:" + rectStartY + "px;width:" + (rowSize-2) + "px;height:" + (rowSize-2) + "px;' onclick='clickedCell(" + col + "," + row + ")' id='cellcol" + col + "row" + row + "'>" +
                    "<div class='cellImg' id='imgcol" + col + "row" + row + "'></div>" +
                    "<div class='displayNum' id='textcol" + col + "row" + row + "'></div>" +
                    "</div>";

                document.getElementById('buildingZone').appendChild(elem);
                view.changePlanetGridCell(col, row);
                view.updatePlanetGridCell(col, row);
            }
            let elem = document.createElement("br");
            document.getElementById('buildingZone').appendChild(elem);
        }
    },
    selectCell(col, row) { //displaying options
        if(col == null || row == null) {
            document.getElementById("selectionOptionsDiv").style.display = "none";
            document.getElementById("buildingInfoDiv").style.display = "none";
            return;
        }

        let theCell = data.systems[data.curSystem].planets[data.curPlanet].grid[col][row];
        if(theCell.type === "" || theCell.type === "ore") {
            document.getElementById("selectionOptionsDiv").style.display = "inline-block";
            document.getElementById("buildmine").style.display = theCell.type === "ore" ? "inline-block" : "none";
            document.getElementById("buildhouse").style.display = data.research[0].unlocked ? "inline-block" : "none";
            document.getElementById("buildserver").style.display = data.research[1].unlocked ? "inline-block" : "none";
            document.getElementById("buildquantumTransport").style.display = data.research[2].unlocked ? "inline-block" : "none";
            document.getElementById("buildradioTelescope").style.display = data.research[3].unlocked ? "inline-block" : "none";
            document.getElementById("buildlaunchPad").style.display = data.research[4].unlocked ? "inline-block" : "none";
        } else {
            document.getElementById("selectionOptionsDiv").style.display = "none";
        }
        if(theCell.type !== "" && theCell.type !== "ore") {
            document.getElementById("buildingInfoDiv").style.display = "inline-block";
            view.createBuildingInfo(theCell);

        } else {
            document.getElementById("buildingInfoDiv").style.display = "none";
        }

        view.updatePlanetGridCell(col, row);
    },
    createBuildingInfo(theCell) {
        let infoDiv = info[theCell.type].infoDiv;
        let title = info[theCell.type].title;
        let extra = info[theCell.type].extra;
        let pausable = info[theCell.type].pausable;

        let costString = "";

        let powerCost = info[theCell.type].power[theCell.mark];
        if(powerCost > 0 && theCell.type !== "solarPanel") {
            costString += "Electricity use: " + powerCost;
        }

        document.getElementById("buildingInfoTitle").innerHTML = title;
        document.getElementById("buildingInfo").innerHTML = costString + "<br>" + infoDiv;
        document.getElementById("buildingExtra").innerHTML = extra;
        document.getElementById("buildingPause").style.display = pausable ? "inline-block" : "none";

        if(document.getElementById("option0")) {
            selectOption(theCell.option);
        }
    },
    updatePlanetGridCell: function(col, row) { //only for updating the num & border
        let theCell = data.systems[data.curSystem].planets[data.curPlanet].grid[col][row];
        if(data.selectedCol === col && data.selectedRow === row && !theCell.isOn) {
            document.getElementById("cellcol" + col + "row" + row).style.border = 'solid 1px #ffb12e';
        } else if(data.selectedCol === col && data.selectedRow === row) {
            document.getElementById("cellcol" + col + "row" + row).style.border = 'solid 1px yellow';
        } else if(!theCell.type || theCell.type === "ore") {
            document.getElementById("cellcol" + col + "row" + row).style.border = 'solid 1px #adadad';
        } else if(!theCell.isOn) {
            document.getElementById("cellcol" + col + "row" + row).style.border = 'solid 1px red';
        } else if(info[theCell.type].pausable) {
            document.getElementById("cellcol" + col + "row" + row).style.border = 'solid 1px green';
        } else {
            document.getElementById("cellcol" + col + "row" + row).style.border = 'solid 1px black';
        }
    },
    changePlanetGridCell: function(col, row) { //for changing the image
        let theCell = data.systems[data.curSystem].planets[data.curPlanet].grid[col][row];
        if(theCell.type) {
            document.getElementById("imgcol" + col + "row" + row).innerHTML = "<img src='img/" + theCell.type + ".svg' class='superLargeIcon imageDragFix'>";
        } else {
            document.getElementById("imgcol" + col + "row" + row).innerHTML = "";
        }

        document.getElementById("textcol" + col + "row" + row).innerHTML = theCell.text;
    },
    changeWorkers: function() {
        let thePlanet = data.systems[data.curSystem].planets[data.curPlanet];

        document.getElementById("workers").innerHTML = thePlanet.workers;
        document.getElementById("mineWorker").innerHTML = thePlanet.mineWorker;
        document.getElementById("factoryWorker").innerHTML = thePlanet.factoryWorker;
        document.getElementById("labWorker").innerHTML = thePlanet.labWorker;
        document.getElementById("quantumTransportWorker").innerHTML = thePlanet.quantumTransportWorker;
        document.getElementById("launchPadWorker").innerHTML = thePlanet.launchPadWorker;

    },
    createResearch: function() {
        document.getElementById("working").style.opacity = (data.research[0].unlocked ? 1 : 0)+"";
        document.getElementById("popDiv").style.display = data.research[0].unlocked ? "inline-block" : "none";
        document.getElementById("workingquantumTransport").style.display = data.research[2].unlocked ? "inline-block" : "none";
        document.getElementById("workinglaunchPad").style.display = data.research[4].unlocked ? "inline-block" : "none";

        let researchDivs = "";
        for(let i = 0; i < data.research.length; i++) {
            if(!data.research[i].unlocked && (data.research[i].req == null || data.research[data.research[i].req].unlocked)) {
                researchDivs +=
                    "<div class='researchDiv'  id='researchDiv" + i + "'>" +
                    "<div class='smallTitle'>" + data.research[i].title + "</div>" +
                    "<div>" + data.research[i].desc + "</div><br>" +
                    "<div class='button' onclick='clickedResearch(" + i + ")'>Buy for " + data.research[i].cost + " science</div>" +
                    "</div>";
            }
        }
        document.getElementById("researchDivs").innerHTML = researchDivs;
    },
    createBuildOptions: function() {
        let buildOptionsDiv = "";
        for(let property in info) {
            if (info.hasOwnProperty(property)) {
                let value = info[property];

                buildOptionsDiv += "<div class='buildOption' id='build"+property+"'>" +
                    "<div class='smallTitle'>"+value.buildTitle+"</div>" +
                    "<div id='"+property+"Desc'>"+value.buildDesc+"</div><br>" +
                    "<div class='button' onclick='buyBuilding(\""+property+"\")'>Build</div>" +
                    "</div>";
            }
        }

        document.getElementById("buildOptions").innerHTML = buildOptionsDiv;
    },
    createErrorMessages: function() {
        let errorDivs = "";

        for(let i = 0; i < errorMessages.length; i++) {
            errorDivs +=
                "<div class='errorMessage' id='error"+i+"'>" +
                "<div class='errorButton' onclick='closeError("+i+")'>ERROR: "+errorMessages[i]+"</div>" +
                "</div>";
        }

        document.getElementById("errorMessages").innerHTML = errorDivs;
    },

};