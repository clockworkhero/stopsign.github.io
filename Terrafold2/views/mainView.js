let view = {
    initialize: function() {
        //auto generated elements
        this.create.rivers();
        this.create.lakes();
        this.create.lakeUniques();

    },
    updating: {
        update: function () {
            view.updating.resources();
            view.updating.rivers();
            view.updating.lakes();
            view.updating.clouds();
            view.updating.lakeUniques();

            view.updating.saveCurrentState();
        },
        saveCurrentState: function () {
            prevState.totalWater = totalWater;
            prevState.res = copyArray(res);
            prevState.rivers = copyArray(rivers);
            prevState.lakes = copyArray(lakes);
            prevState.clouds = copyArray(clouds);
            prevState.cbotRows = copyArray(cbotRows);
        },
        resources: function() {
            if(prevState.totalWater !== totalWater) {
                document.getElementById("totalWater").innerHTML = intToString(totalWater, 1);
            }
            if(!prevState.res || prevState.res.cash !== res.cash) {
                document.getElementById("cash").innerHTML = res.cash;
            }
            if(!prevState.res || prevState.res.ice !== res.ice) {
                document.getElementById("ice").innerHTML = intToString(res.ice, 4);
            }
            if(!prevState.res || prevState.res.cbots !== res.cbots) {
                document.getElementById("cbots").innerHTML = res.cbots;
            }
            if(!prevState.res || prevState.res.cbotsMax !== res.cbotsMax) {
                document.getElementById("cbotsMax").innerHTML = res.cbotsMax;
            }
            if(!prevState.res || prevState.res.ore !== res.ore) {
                document.getElementById("ore").innerHTML = intToString(res.ore, 1);
            }
            if(!prevState.res || prevState.res.iron !== res.iron) {
                document.getElementById("iron").innerHTML = intToString(res.iron, 1);
            }
            if(!prevState.res || prevState.res.dirt !== res.dirt) {
                document.getElementById("dirt").innerHTML = intToString(res.dirt, 1);
            }
        },
        rivers: function() {
            for(let i = 0; i < rivers.length; i++) {
                for(let j = 0; j < rivers[i].chunks.length; j++) {
                    if(!prevState.rivers || prevState.rivers[i].chunks[j].water !== rivers[i].chunks[j].water) {
                        document.getElementById(i + "_riverwater_" + j).innerHTML = intToString(rivers[i].chunks[j].water, 4);
                    }
                }
            }
        },
        lakes: function() {
            for(let i = 0; i < lakes.length; i++) {
                if(!prevState.lakes || prevState.lakes[i].water !== lakes[i].water) {
                    document.getElementById("lakewater_"+i).innerHTML = intToString(lakes[i].water, 4);
                }
                if(!prevState.lakes || prevState.lakes[i].water !== lakes[i].water) {
                    document.getElementById("lakeminimum_"+i).innerHTML = intToString(lakes[i].minimum, 1);
                }
                if(!prevState.lakes || prevState.lakes[i].capacity !== lakes[i].capacity) {
                    document.getElementById("lakecapacity_"+i).innerHTML = intToString(lakes[i].capacity, 1);
                }
                if(!prevState.lakes || prevState.lakes[i].intake !== lakes[i].intake) {
                    document.getElementById("lakeintake_"+i).innerHTML = intToString(lakes[i].intake, 4);
                }
                if(!prevState.lakes || prevState.lakes[i].overflow !== lakes[i].overflow) {
                    document.getElementById("lakeoverflow_"+i).innerHTML = intToString(lakes[i].overflow, 4);
                }
                if(!prevState.lakes || prevState.lakes[i].electricity !== lakes[i].electricity) {
                    document.getElementById("lakeelectricity_"+i).innerHTML = intToString(lakes[i].electricity, 4);
                }
                if(!prevState.lakes || prevState.lakes[i].evaporated !== lakes[i].evaporated) {
                    document.getElementById("lakeevaporated_"+i).innerHTML = intToString(lakes[i].evaporated, 5);
                }
            }
        },
        clouds: function() {
            for(let i = 0; i < clouds.length; i++) {
                if(!prevState.clouds || prevState.clouds[i].water !== clouds[i].water) {
                    document.getElementById("cloudwater_"+i).innerHTML = intToString(clouds[i].water, 4);
                }
                if(i === 0 && (!prevState.clouds || prevState.clouds[i].rain !== clouds[i].rain)) {
                    document.getElementById("cloudrain_"+i).innerHTML = intToString(clouds[i].rain, 4);
                }
                if(i === 0 && (!prevState.clouds || prevState.clouds[i].rainTimer !== clouds[i].rainTimer)) {
                    document.getElementById("cloudrainTimer_"+i).innerHTML = intToString(clouds[i].rainTimer/20, 1)+"s";
                }
                if(i === 0 && (!prevState.clouds || prevState.clouds[i].rainDuration !== clouds[i].rainDuration)) {
                    document.getElementById("cloudrainDuration_"+i).innerHTML = intToString(clouds[i].rainDuration/20, 1)+"s";
                }
                if(i !== 0 && (!prevState.clouds || prevState.clouds[i].windTimer !== clouds[i].windTimer)) {
                    document.getElementById("cloudwindTimer_"+i).innerHTML = intToString(clouds[i].windTimer/20, 1)+"s";
                }

            }
        },
        lakeUniques: function() {
            for(let i = 0; i < cbotRows.length; i++) {
                if(!prevState.cbotRows || prevState.cbotRows[i].pCurrent !== cbotRows[i].pCurrent) {
                    document.getElementById("progress" + cbotRows[i].id).style.width = (cbotRows[i].pCurrent / cbotRows[i].pNeeded * 100) + "%";
                    document.getElementById("pSecs"+cbotRows[i].id).innerHTML = (cbotRows[i].pNeeded - cbotRows[i].pCurrent)/20 + "s";
                }
                if(!prevState.cbotRows || prevState.cbotRows[i].numLeft !== cbotRows[i].numLeft) {
                    document.getElementById("numLeft" + cbotRows[i].id).value = cbotRows[i].numLeft;
                }
                if(!prevState.cbotRows || prevState.cbotRows[i].cbotCount !== cbotRows[i].cbotCount) {
                    document.getElementById("cbotCount"+cbotRows[i].id).innerHTML = cbotRows[i].cbotCount;
                }
            }
        }
    },
    create: {
        rivers: function() {
            for(let i = 0; i < rivers.length; i++) {
                let divText = "";
                let river = rivers[i];
                for(let j = 0; j < river.chunks.length; j++) {
                    divText += "River "+i+" Chunk " + j + ": <div id='"+i+"_riverwater_"+j+"' class='preciseNum'></div> water<br>";
                }

                document.getElementById("riverContainer" + i).innerHTML = divText;
            }
        },
        lakes: function() {
            for(let i = 0; i < lakes.length; i++) {
                let divText = "";
                divText += "Lake "+i+
                    " water: <div id='lakewater_"+i+"' class='preciseNum'></div>" +
                    " minimum: <div id='lakeminimum_"+i+"' class='preciseNum'></div>" +
                    " capacity: <div id='lakecapacity_"+i+"' class='preciseNum'></div>" +
                    " intake: <div id='lakeintake_"+i+"' class='preciseNum'></div>" +
                    " overflow: <div id='lakeoverflow_"+i+"' class='preciseNum'></div>" +
                    " electricity: <div id='lakeelectricity_"+i+"' class='preciseNum'></div>" +
                    " evaporated: <div id='lakeevaporated_"+i+"' class='preciseNum'></div>" +
                    "<br>";

                divText += "Cloud "+i+
                    " water: <div id='cloudwater_"+i+"' class='preciseNum'></div>" +
                    (i !== 0 ? "" : " rain: <div id='cloudrain_"+i+"' class='preciseNum'></div>") +
                    (i !== 0 ? "" : " next rain: <div id='cloudrainTimer_"+i+"' class='preciseNum'></div>") +
                    (i !== 0 ? "" : " rain stops: <div id='cloudrainDuration_"+i+"' class='preciseNum'></div>") +
                    (i === 0 ? "" : " next wind: <div id='cloudwindTimer_"+i+"' class='preciseNum'></div>") +
                    "<br>";

                document.getElementById("lakeContainer" + i).innerHTML = divText;
            }
        },
        lakeUniques: function() {
            document.getElementById("lakeContainer0").innerHTML += "Ore: <div id='ore'></div><br>";

            for(let i = 0; i < cbotRows.length; i++) {
                document.getElementById("lakeContainer" + cbotRows[i].lake).innerHTML += view.helpers.cbotRow(cbotRows[i]);
            }
        },
    },
    helpers: {
        cbotRow: function(cbotRow) {
            //Mine ore | bot count | amount | progress (seconds) | auto
            return "<div class='bold' style='width:90px'>" + cbotRow.name + "</div>" +
                " C.Bots <div id='cbotCount"+cbotRow.id+"' class='bold'></div> <div class='fa fa-plus clickable' onclick='addCbots("+cbotRow.id+")'></div> <div class='fa fa-minus clickable' onclick='subtractCbots("+cbotRow.id+")'></div>" +
                " <label for='numLeft"+cbotRow.id+"'>Num Left</label> <input id='numLeft"+cbotRow.id+"' type='number' class='inputNum' value='0' onchange='changeNumLeft("+cbotRow.id+")'>" +
                " <div class='progressOuter'><div class='progressInner' id='progress"+cbotRow.id+"'></div><div id='pSecs"+cbotRow.id+"' style='color:white;' class='abs bold small'></div></div>" +
                " <label for='auto"+cbotRow.id+"'>Auto</label><input type='checkbox' id='auto"+cbotRow.id+"' onchange='changeAuto("+cbotRow.id+")'>" +
                "<br>";
        }
    }
};
