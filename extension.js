import { lib, game, ui, get, ai, _status } from "../../noname.js";
game.import("extension",function(){
	return {name:"破界重塑",content:function (config, pack) {
            lib.translate.chong_standard = "标准";

            lib.characterSort['mode_extension_破界重塑'] = {
                'chong_standard': ['chong_liubei',"chong_sunquan"],
            };
            game.randomGetInt = function (max) {
                return Math.round(Math.random() * (max - 1)) + 1;
            }
            game.playChong = function (skill, num) {
                if (lib.config.background_speak) {
                    game.playAudio('..', 'extension', '破界重塑', "character", skill + game.randomGetInt(num) + ".mp3");
                }
            };
            /*game.chongdir=function(player,skill)
            {
                return ["ext:破界重塑/character/"+player.name+"/"+skill+1+".mp3","ext:破界重塑/character/"+player.name+"/"+skill+2+".mp3"];
            }*/
        },precontent:function () {

        },help:{},config:{},package:{
    character: {
        character: {
            "chong_liubei": ["male","shu",4,["chong_rende","chong_dewei","chong_renze","chong_jijiang"],["zhu","ext:破界重塑/character/chong_liubei/1.jpg","die:ext:破界重塑/character/chong_liubei/die.mp3"]],
            "chong_sunquan": ["male","wu",4,["chong_zhiheng","chong_jiuyuan"],["zhu","ext:破界重塑/character/chong_sunquan/1.png","die:ext:破界重塑/character/chong_sunquan/die.mp3"]],
        },
        translate: {
            "chong_liubei": "重刘备",
            "破界重塑": "破界重塑",
            "chong_sunquan": "重孙权",
        },
    },
    card: {
        card: {
        },
        translate: {
        },
        list: [],
    },
    skill: {
        skill: {
            "chong_rende": {
                mark: true,
                marktext: "仁",
                audio: ["ext:破界重塑/character/chong_liubei/chong_rende1.mp3","ext:破界重塑/character/chong_liubei/chong_rende2.mp3"],
                intro: {
                    name: "仁德",
                    content: function (storage, player) {
                        return "已拥有" + player.countMark("chong_rende") + "个\"仁\"标记";
                    },
                },
                enable: "phaseUse",
                filterCard: true,
                selectCard: [1,Infinity],
                discard: false,
                lose: false,
                delay: 0,
                filterTarget(card, player, target) {
                    return player != target;
                },
                filter:function(event,player){
                    return player.countCards("he")>0;
                },
                check(card) {
                    if (ui.selected.cards.length > 1) return 0;
                    if (ui.selected.cards.length && ui.selected.cards[0].name == "du") return 0;
                    if (!ui.selected.cards.length && card.name == "du") return 20;
                    const player = get.owner(card);
                    let num = 0;
                    const evt2 = _status.event.getParent();
                    if (player.hp == player.maxHp || num > 1 || player.countCards("h") <= 1) {
                        if (ui.selected.cards.length) {
                            return -1;
                        }
                        const players = game.filterPlayer();
                        for (let i = 0; i < players.length; i++) {
                            if (players[i].hasSkill("haoshi") && !players[i].isTurnedOver() && !players[i].hasJudge("lebu") && get.attitude(player, players[i]) >= 3 && get.attitude(players[i], player) >= 3) {
                                return 11 - get.value(card);
                            }
                        }
                        if (player.countCards("h") > player.hp) return 10 - get.value(card);
                        if (player.countCards("h") > 2) return 6 - get.value(card);
                        return -1;
                    }
                    return 10 - get.value(card);
                },
                async content(event, trigger, player) {
                    player.give(event.cards, event.target);
                    player.addMark("chong_rende", event.cards.length);
                },
                ai: {
                    order(skill, player) {
                        if (player.hp < player.maxHp && player.storage.rende < 2 && player.countCards("h") > 1) {
                            return 10;
                        }
                        return 1;
                    },
                    result: {
                        target(player, target) {
                            if (target.hasSkillTag("nogain")) return 0;
                            if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
                                return target.hasSkillTag("nodu") ? 0 : -10;
                            }
                            if (target.hasJudge("lebu")) return 0;
                            const nh = target.countCards("h");
                            const np = player.countCards("h");
                            if (player.hp == player.maxHp || player.storage.rende < 0 || player.countCards("h") <= 1) {
                                if (nh >= np - 1 && np <= player.hp && !target.hasSkill("haoshi")) return 0;
                            }
                            return Math.max(1, 5 - nh);
                        },
                    },
                    effect: {
                        target_use(card, player, target) {
                            if (player == target && get.type(card) == "equip") {
                                if (player.countCards("e", { subtype: get.subtype(card) })) {
                                    const players = game.filterPlayer();
                                    for (let i = 0; i < players.length; i++) {
                                        if (players[i] != player && get.attitude(player, players[i]) > 0) {
                                            return 0;
                                        }
                                    }
                                }
                            }
                        },
                    },
                    threaten: 0.8,
                },
                "_priority": 0,
            },
            "chong_renze": {
                audio: ["ext:破界重塑/character/chong_liubei/chong_renze1.mp3","ext:破界重塑/character/chong_liubei/chong_renze2.mp3"],
                trigger: {
                    player: ["phaseEnd"],
                },
                async content(event, trigger, player) {
                    var num = player.countCards("h");
                    for (var i of game.filterPlayer()) {
                        if (i.countCards("h") == num)
                            await i.draw();
                    }
                },
                prompt: function () {
                    return "是否发动〖仁泽〗使手牌数为" + _status.event.player.countCards("h") + "的角色摸一张牌";
                },
                "_priority": 0,
            },
            "chong_dewei": {
                audio: ["ext:破界重塑/character/chong_liubei/chong_dewei1.mp3","ext:破界重塑/character/chong_liubei/chong_dewei2.mp3"],
                group: ["chong_dewei_begin"],
                init: function (player) {
                    player.storage.chong_dewei = true;//true代表德威可发动
                },
                subSkill: {
                    begin: {
                        forced: true,
                        popup: false,
                        trigger: {
                            global: "phaseBegin",
                        },
                        async content(event, trigger, player) {
                            player.storage.chong_dewei = true;
                        },
                        sub: true,
                        sourceSkill: "chong_dewei",
                        "_priority": 0,
                    },
                },
                enable: ["chooseToUse","chooseToRespond"],
                hiddenCard: function (player, name) {
                    if (get.type(name) == "basic" && lib.inpile.includes(name) && player.countMark("chong_rende") >= 2 && player.storage.chong_dewei) return true;
                },
                filter: function (event, player) {
                    if (event.responded || event.jinzhi || player.countMark("chong_rende") < 2 || !player.storage.chong_dewei || event.type == "wuxie") return false;
                    for (var i of lib.inpile) {
                        if (get.type(i) == "basic" && event.filterCard({ name: i, isCard: true }, player, event)) return true;
                    }
                    return false;
                },
                chooseButton: {
                    dialog: function (event, player) {
                        var list = [];
                        for (var i of lib.inpile) {
                            if (get.type(i) == "basic" && event.filterCard({ name: i, isCard: true }, player, event)) {
                                list.push(["基本", "", i]);
                                if (i == "sha") {
                                    for (var j of lib.inpile_nature) list.push(["基本", "", "sha", j]);
                                }
                            }
                        }
                        return ui.create.dialog("德威", [list, "vcard"], "hidden");
                    },
                    check: function (button) {
                        if (_status.event.getParent().type != "phase") return 1;
                        if (button.link[2] == "shan") return 3;
                        var player = _status.event.player;
                        if (button.link[2] == "jiu") {
                            if (player.getUseValue({ name: "jiu" }) <= 0) return 0;
                            if (player.countCards("h", "sha")) return player.getUseValue({ name: "jiu" });
                        }
                        return player.getUseValue({ name: button.link[2], nature: button.link[3] }) / 4;
                    },
                    backup: function (links, player) {
                        return {
                            selectCard: 0,
                            popname: true,
                            viewAs: {
                                name: links[0][2],
                                nature: links[0][3],
                                suit: "none",
                                number: null,
                                isCard: true,
                            },
                            ignoreMod: true,
                            precontent: function () {
                                player.removeMark("chong_rende", 2);
                                player.storage.chong_dewei = false;
                                game.playChong("chong_liubei/chong_dewei", 2)
                            },
                        };
                    },
                    prompt: function (links, player) {
                        var name = links[0][2];
                        var nature = links[0][3];
                        return "移去两枚\"仁\"标记视为使用" + (get.translation(nature) || "") + get.translation(name);
                    },
                },
                "_priority": 0,
            },
            "chong_jijiang": {
                enable: "phaseUse",
                audio: ["ext:破界重塑/character/chong_liubei/chong_jijiang1.mp3","ext:破界重塑/character/chong_liubei/chong_jijiang2.mp3"],
                usable: 1,
                zhuSkill: true,
                unique: true,
                selectTarget: 2,
                multitarget: true,
                filterTarget: function (card, player, target) {
                    if (ui.selected.targets.length == 0) {
                        if (player != target && target.group == "shu" && target.countCards("he") > 0) return true;
                    }
                    if (ui.selected.targets.length == 1) {
                        return target.canUse({ name: "sha" }, ui.selected.targets[0]);
                    }
                },
                filter:function(event,player){
                    return game.hasPlayer(current=>current!=player&&current.group=="shu");
                },
                targetprompt: ["出杀","杀目标"],
                async content(event, trigger, player) {
                    const target = event.targets[0];
                    const { result } = await target.chooseToUse("激将：对" + get.translation(event.targets[1]) + "使用一张杀，或交给" + get.translation(player) + "一张牌", { name: "sha" }, event.targets[1], -1);
                    if (result.bool == false && target.countCards("he") > 0) {
                        const result2 = await target.chooseCard("he", true, "选择一张牌交给" + get.translation(player)).forResult();
                        if (result2.bool == true) target.give(result2.cards, player);
                    }
                },
                "_priority": 0,
            },
            "chong_zhiheng": {
                group: ["chong_zhiheng_use","chong_zhiheng_end"],
                locked: false,
                audio: ["ext:破界重塑/character/chong_sunquan/chong_zhiheng1.mp3","ext:破界重塑/character/chong_sunquan/chong_zhiheng2.mp3"],
                enable: "phaseUse",
                usable: 1,
                position: "he",
                filterCard: true,
                selectCard: [0,Infinity],
                async content(event, trigger, player) {
                    let cards = player.getCards("h");
                    player.addGaintag(cards, "chong_zhiheng_tag");
                    player.markAuto("chong_zhiheng", cards);
                    await player.draw(event.cards.length);
                },
                subSkill: {
                    use: {
                        trigger: {
                            player: ["useCard","respond"],
                        },
                        direct: true,
                        filter(event, player) {
                            return event.player.hasHistory("lose", function (evt) {
                                if (evt.getParent() != event) return false;
                                for (var i in evt.gaintag_map) {
                                    if (evt.gaintag_map[i].includes("chong_zhiheng_tag")) return true;
                                }
                                return false;
                            });
                        },
                        async content(event, trigger, player) {
                            await player.draw();
                            game.playChong("chong_sunquan/chong_zhiheng", 2)
                        },
                        sub: true,
                        sourceSkill: "chong_zhiheng",
                        "_priority": 0,
                    },
                    end: {
                        forced: true,
                        trigger: {
                            player: "phaseUseEnd",
                        },
                        filter: function(event,player){
                            return player.hasCard(card =>card.hasGaintag("chong_zhiheng_tag"),"h");
                        },
                        async content(event,trigger,player){
                            await player.loseHp(player.countCards("h",card=>card.hasGaintag("chong_zhiheng_tag")));
                            player.removeGaintag("chong_zhiheng_tag");
                        },
                        sub: true,
                        sourceSkill: "chong_zhiheng",
                        "_priority": 0,
                    },
                },
                "_priority": 0,
            },
            "chong_jiuyuan": {
                audio: ["ext:破界重塑/character/chong_sunquan/chong_jiuyuan1.mp3","ext:破界重塑/character/chong_sunquan/chong_jiuyuan2.mp3"],
                enable:"phaseUse",
                usable:1,
                zhuSkill:true,
                position:"he",
                filterCard:true,
                selectCard:1,
                discard:false,
                lose:false,
                selectTarget:1,
                filterTarget:function(card,player,target){
                    return player!=target&&target.group=="wu"&&target.hp>=player.hp;
                },
                filter:function(event,player){
                    return game.hasPlayer(current=>current!=player&&current.group=="wu"&&current.hp>=player.hp);
                },
                async content(event,trigger,player){
                    await player.give(event.cards,event.target);
                    var result = await event.target.chooseControl("失去体力","让"+get.translation(player)+"回复一点体力").forResult();
                    if(result.control=="失去体力"){
                        await event.target.loseHp();
                    }
                    if(result.control=="让"+get.translation(player)+"回复一点体力"){
                        await player.recover();
                    }
                },
            },
        },
        translate: {
            "chong_rende": "仁德",
            "chong_rende_info": "出牌阶段，你可以将任意张手牌交给其他角色。你每给出一张牌获得一个\"仁\"标记",
            "chong_renze": "仁泽",
            "chong_renze_info": "回合结束时，你可以令全场手牌数与你相同的角色摸一张牌",
            "chong_dewei": "德威",
            "chong_dewei_info": "每回合限一次，你可以移去两个\"仁\"标记，视为你使用或打出一张基本牌",
            "chong_jijiang": "激将",
            "chong_jijiang_info": "主公技，出牌阶段限一次，你可以选择一名蜀势力角色，对你选择的另一名合法目标出杀，否则他给你一张牌",
            "chong_zhiheng": "制衡",
            "chong_zhiheng_info": "每回合限一次，你可以弃置任意数量的牌，将其余手牌称为\"衡\"，然后摸以此法弃置数量的牌。当你于本出牌阶段使用或打出\"衡\"时，你摸一张牌。出牌阶段结束时，你失去手牌中\"衡\"的数量的体力",
            "chong_zhiheng_tag": "衡",
            "chong_jiuyuan": "救援",
            "chong_jiuyuan_info": "主公技，每回合限一次，你可以给体力值大于等于你的吴势力角色一张牌，其选择一项，①失去一点体力，②让你回复一点体力",
        },
    },
    intro: "",
    author: "微禾",
    diskURL: "",
    forumURL: "",
    version: "1.0",
},files:{"character":[],"card":[],"skill":[],"audio":[]}}
});