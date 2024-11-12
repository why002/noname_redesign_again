import { lib, game, ui, get, ai, _status } from "../../noname.js";
const chong_src = "ext:破界重塑/character";
game.import("extension", function () {
    return {
        name: "破界重塑", content: function (config, pack) {
            lib.translate.chong_standard = "标准";
            lib.characterSort['mode_extension_破界重塑'] = {
                'chong_standard': ['chong_liubei', "chong_sunquan", "chong_caocao",
                    "chong_guanyu"
                ],
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
                return [chong_src+"/"+player.name+"/"+skill+1+".mp3",chong_src+"/"+player.name+"/"+skill+2+".mp3"];
            }*/
        }, precontent: function () {

        }, help: {}, config: {}, package: {
            character: {
                character: {
                    "chong_liubei": ["male", "shu", 4, ["chong_rende", "chong_dewei", "chong_renze", "chong_jijiang"], ["zhu", `${chong_src}/chong_liubei/1.jpg`, `die:${chong_src}/chong_liubei/die.mp3`]],
                    "chong_sunquan": ["male", "wu", 4, ["chong_zhiheng", "chong_jiuyuan"], ["zhu", `${chong_src}/chong_sunquan/1.png`, `die:${chong_src}/chong_sunquan/die.mp3`]],
                    "chong_caocao": ["male", "wei", 4, ["chong_jianxiong", "chong_xieling", "chong_hujia"], ["zhu", `${chong_src}/chong_caocao/1.jpg`, `die:${chong_src}/chong_caocao/die.mp3`]],
                    "chong_guanyu": ["male", "shu", 4, ["chong_wusheng"], [`${chong_src}/chong_guanyu/1.jpg`]],
                },
                translate: {
                    "chong_liubei": "重刘备",
                    "破界重塑": "破界重塑",
                    "chong_sunquan": "重孙权",
                    "chong_caocao": "重曹操",
                    "chong_guanyu": "重关羽",
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
                    "chong_jianxiong": {
                        group: ["chong_jianxiong_tagSkill"],
                        audio: [chong_src + "/chong_caocao/chong_jianxiong1.mp3", chong_src + "/chong_caocao/chong_jianxiong2.mp3"],
                        trigger: {
                            player: "damageEnd",
                        },
                        async content(event, trigger, player) {
                            if (get.itemtype(trigger.cards) == "cards" && get.position(trigger.cards[0], true) == "o") {
                                await player.gain(trigger.cards, "gain2");
                                await player.addGaintag(trigger.cards, "chong_jianxiong_tag");
                            }
                            await player.draw(trigger.num);
                        },
                        ai: {
                            maixie: true,
                            "maixie_hp": true,
                            effect: {
                                target(card, player, target) {
                                    if (player.hasSkillTag("jueqing", false, target)) return [1, -1];
                                    if (get.tag(card, "damage")) return [1, 0.55];
                                },
                            },
                        },
                        subSkill: {
                            tagSkill: {
                                trigger: {
                                    source: "damageBegin1",
                                },
                                audio: "chong_jianxiong",
                                filter(event, player) {
                                    if (!event.card) return false;
                                    const evt = event.getParent("useCard");
                                    if (!evt || evt.card !== event.card || evt.cards?.length !== 1) return false;
                                    return player.hasHistory(
                                        "lose",
                                        evtx =>
                                            evtx.getParent() === evt &&
                                            Object.keys(evtx.gaintag_map).some(i => {
                                                return evtx.gaintag_map[i].some(tag => tag.startsWith("chong_jianxiong_tag"));
                                            })
                                    );
                                },
                                forced: true,
                                async content(event, trigger, player) {
                                    trigger.num++;
                                },
                                sub: true,
                                sourceSkill: "chong_jianxiong",
                                "_priority": 0,
                            },
                        },
                        "_priority": 0,
                    },
                    "chong_rende": {
                        mark: true,
                        marktext: "仁",
                        audio: [chong_src + "/chong_liubei/chong_rende1.mp3", chong_src + "/chong_liubei/chong_rende2.mp3"],
                        intro: {
                            name: "仁德",
                            content: function (storage, player) {
                                return "已拥有" + player.countMark("chong_rende") + "个\"仁\"标记";
                            },
                        },
                        enable: "phaseUse",
                        filterCard: true,
                        selectCard: [1, Infinity],
                        discard: false,
                        lose: false,
                        delay: 0,
                        filterTarget(card, player, target) {
                            return player != target;
                        },
                        filter: function (event, player) {
                            return player.countCards("he") > 0;
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
                        audio: [chong_src + "/chong_liubei/chong_renze1.mp3", chong_src + "/chong_liubei/chong_renze2.mp3"],
                        trigger: {
                            player: ["phaseEnd"],
                        },
                        async content(event, trigger, player) {
                            var num = player.countCards("h");
                            var j = 0
                            for (var i of game.filterPlayer()) {
                                if (i.countCards("h") == num) {
                                    j += 1;
                                    await i.draw();
                                }
                            }
                            if (j > 1) {
                                player.draw();
                                player.addMark("chong_rende");
                            }
                        },
                        prompt: function () {
                            return "是否发动〖仁泽〗使手牌数为" + _status.event.player.countCards("h") + "的角色摸一张牌";
                        },
                        "_priority": 0,
                    },
                    "chong_dewei": {
                        audio: [chong_src + "/chong_liubei/chong_dewei1.mp3", chong_src + "/chong_liubei/chong_dewei2.mp3"],
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
                        enable: ["chooseToUse", "chooseToRespond"],
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
                        audio: [chong_src + "/chong_liubei/chong_jijiang1.mp3", chong_src + "/chong_liubei/chong_jijiang2.mp3"],
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
                        filter: function (event, player) {
                            return game.hasPlayer(current => current != player && current.group == "shu");
                        },
                        targetprompt: ["出杀", "杀目标"],
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
                        group: ["chong_zhiheng_use", "chong_zhiheng_end"],
                        locked: false,
                        audio: [chong_src + "/chong_sunquan/chong_zhiheng1.mp3", chong_src + "/chong_sunquan/chong_zhiheng2.mp3"],
                        enable: "phaseUse",
                        usable: 1,
                        position: "he",
                        filterCard: true,
                        selectCard: [0, Infinity],
                        async content(event, trigger, player) {
                            let cards = player.getCards("h");
                            player.addGaintag(cards, "chong_zhiheng_tag");
                            player.markAuto("chong_zhiheng", cards);
                            await player.draw(event.cards.length);
                        },
                        subSkill: {
                            use: {
                                trigger: {
                                    player: ["useCard", "respond"],
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
                                filter: function (event, player) {
                                    return player.hasCard(card => card.hasGaintag("chong_zhiheng_tag"), "h");
                                },
                                async content(event, trigger, player) {
                                    await player.loseHp(player.countCards("h", card => card.hasGaintag("chong_zhiheng_tag")));
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
                        audio: [chong_src + "/chong_sunquan/chong_jiuyuan1.mp3", chong_src + "/chong_sunquan/chong_jiuyuan2.mp3"],
                        enable: "phaseUse",
                        usable: 1,
                        zhuSkill: true,
                        position: "he",
                        filterCard: true,
                        selectCard: 1,
                        discard: false,
                        lose: false,
                        selectTarget: 1,
                        filterTarget: function (card, player, target) {
                            return player != target && target.group == "wu" && target.hp >= player.hp;
                        },
                        filter: function (event, player) {
                            return game.hasPlayer(current => current != player && current.group == "wu" && current.hp >= player.hp) && player.countCards("he") > 0;
                        },
                        async content(event, trigger, player) {
                            await player.give(event.cards, event.target);
                            var result = await event.target.chooseControl("失去体力", "让" + get.translation(player) + "回复一点体力").forResult();
                            if (result.control == "失去体力") {
                                await event.target.loseHp();
                            }
                            if (result.control == "让" + get.translation(player) + "回复一点体力") {
                                await player.recover();
                            }
                        },
                        "_priority": 0,
                    },
                    "chong_xieling": {
                        audio: [chong_src + "/chong_caocao/chong_xieling1.mp3", chong_src + "/chong_caocao/chong_xieling2.mp3"],
                        trigger: {
                            player: "phaseUseBegin",
                        },
                        filter: function (event, player) {
                            return player.countCards("h") > 0;
                        },
                        async cost(event, trigger, player) {
                            var resultCard = await player.chooseToDiscard("挟令：请弃置一张牌，让所有人本回合无法使用或打出该花色的牌", "h").forResult();
                            if (resultCard.bool) {
                                event.result = resultCard;
                            }
                        },
                        async content(event, trigger, player) {
                            var card = event.cards;
                            player.storage.chong_xieling_suit = get.suit(card);
                            await player.addTempSkill("chong_xieling_suit", { player: ["phaseEnd", "die"] });
                            await player.draw();
                            await player.markSkill("chong_xieling_suit");
                        },
                        subSkill: {
                            suit: {
                                onremove: true,
                                global: "chong_xieling_suit2",
                                marktext: "令",
                                intro: {
                                    content: function (suit) {
                                        var str = "禁止使用或打出";
                                        str += get.translation(suit);
                                        str += "花色的牌";
                                        return str;
                                    },
                                },
                                mod: {
                                    ignoredHandcard: function (card, player) {
                                        if (card.suit == player.storage.chong_xieling_suit) return true;
                                    },
                                    cardDiscardable: function (card, player, name) {
                                        if (name == "phaseDiscard" && card.suit == player.storage.chong_xieling_suit) {
                                            return false;
                                        }
                                    },
                                    cardEnabled: function (card, player) {
                                        if (card.suit == player.storage.chong_xieling_suit) return false;
                                    },
                                },
                                sub: true,
                                sourceSkill: "chong_xieling",
                                "_priority": 0,
                            },
                            "suit2": {
                                mod: {
                                    cardEnabled: function (card, player) {
                                        if (game.hasPlayer(current => { return card.suit == current.storage.chong_xieling_suit })) return false;
                                    },
                                },
                                sub: true,
                                sourceSkill: "chong_xieling",
                                "_priority": 0,
                            },
                        },
                        "_priority": 0,
                    },
                    "chong_hujia": {
                        audio: [chong_src + "/chong_caocao/chong_hujia1.mp3", chong_src + "/chong_caocao/chong_hujia2.mp3"],
                        zhuSkill: true,
                        trigger: {
                            player: "damageAfter",
                        },
                        filter: function (event, player) {
                            if (player.hasSkill("chong_hujia_used") || event.source == undefined) {
                                return false;
                            }
                            if (game.hasPlayer(current => current != player && current.group == "wei" && current != event.source)) {
                                return true;
                            }
                            return false;
                        },
                        async cost(event, trigger, player) {
                            var str = "〖护驾〗选择一名魏势力角色，你回复一点体力，其受到来自" + get.translation(trigger.source) + "的一点伤害";
                            event.result = await player.chooseTarget(str,
                                function (card, player, target) {
                                    return target != player && target.group == "wei" && target != trigger.source;
                                }
                            ).forResult();
                        },
                        async content(event, trigger, player) {
                            await player.recover();
                            await event.targets[0].damage(1, trigger.source);
                            await player.addTempSkill("chong_hujia_used", "roundStart");
                        },
                        subSkill: {
                            used: {
                                mark: true,
                                intro: {
                                    content: "本轮已发动",
                                },
                                sub: true,
                                sourceSkill: "chong_hujia",
                                "_priority": 0,
                            },
                        },
                        "_priority": 0,
                    },
                    "chong_wusheng": {
                        mod: {
                            targetInRange: function (card) {
                                if (get.color(card) == "red" && card.name == "sha") return true;
                            }
                        },
                        group: ["chong_wusheng_equip"],
                        audio: [chong_src + "/chong_guanyu/chong_wusheng1.mp3", chong_src + "/chong_guanyu/chong_wusheng2.mp3"],
                        audioname: ["re_guanyu", "jsp_guanyu", "re_guanzhang", "dc_jsp_guanyu"],
                        enable: ["chooseToRespond", "chooseToUse"],
                        filterCard(card, player) {
                            if (get.zhu(player, "shouyue")) return true;
                            return get.color(card) == "red";
                        },
                        position: "hes",
                        viewAs: {
                            name: "sha",
                        },
                        viewAsFilter(player) {
                            if (get.zhu(player, "shouyue")) {
                                if (!player.countCards("hes")) return false;
                            } else {
                                if (!player.countCards("hes", { color: "red" })) return false;
                            }
                        },
                        prompt: "将一张红色牌当杀使用或打出",
                        check(card) {
                            const val = get.value(card);
                            if (_status.event.name == "chooseToRespond") return 1 / Math.max(0.1, val);
                            return 5 - val;
                        },
                        ai: {
                            skillTagFilter(player) {
                                if (get.zhu(player, "shouyue")) {
                                    if (!player.countCards("hes")) return false;
                                } else {
                                    if (!player.countCards("hes", { color: "red" })) return false;
                                }
                            },
                            respondSha: true,
                            yingbian: function (card, player, targets, viewer) {
                                if (get.attitude(viewer, player) <= 0) return 0;
                                var base = 0,
                                    hit = false;
                                if (get.cardtag(card, "yingbian_hit")) {
                                    hit = true;
                                    if (
                                        targets.some((target) => {
                                            return (
                                                target.mayHaveShan(
                                                    viewer,
                                                    "use",
                                                    target.getCards("h", (i) => {
                                                        return i.hasGaintag("sha_notshan");
                                                    })
                                                ) &&
                                                get.attitude(viewer, target) < 0 &&
                                                get.damageEffect(target, player, viewer, get.natureList(card)) > 0
                                            );
                                        })
                                    )
                                        base += 5;
                                }
                                if (get.cardtag(card, "yingbian_add")) {
                                    if (
                                        game.hasPlayer(function (current) {
                                            return (
                                                !targets.includes(current) &&
                                                lib.filter.targetEnabled2(card, player, current) &&
                                                get.effect(current, card, player, player) > 0
                                            );
                                        })
                                    )
                                        base += 5;
                                }
                                if (get.cardtag(card, "yingbian_damage")) {
                                    if (
                                        targets.some((target) => {
                                            return (
                                                get.attitude(player, target) < 0 &&
                                                (hit ||
                                                    !target.mayHaveShan(
                                                        viewer,
                                                        "use",
                                                        target.getCards("h", (i) => {
                                                            return i.hasGaintag("sha_notshan");
                                                        })
                                                    ) ||
                                                    player.hasSkillTag(
                                                        "directHit_ai",
                                                        true,
                                                        {
                                                            target: target,
                                                            card: card,
                                                        },
                                                        true
                                                    )) &&
                                                !target.hasSkillTag("filterDamage", null, {
                                                    player: player,
                                                    card: card,
                                                    jiu: true,
                                                })
                                            );
                                        })
                                    )
                                        base += 5;
                                }
                                return base;
                            },
                            canLink: function (player, target, card) {
                                if (!target.isLinked() && !player.hasSkill("wutiesuolian_skill")) return false;
                                if (
                                    player.hasSkill("jueqing") ||
                                    player.hasSkill("gangzhi") ||
                                    target.hasSkill("gangzhi")
                                )
                                    return false;
                                return true;
                            },
                            basic: {
                                useful: [5, 3, 1],
                                value: [5, 3, 1],
                            },
                            order(item, player) {
                                let res = 3.2;
                                if (player.hasSkillTag("presha", true, null, true)) res = 10;
                                if (
                                    typeof item !== "object" ||
                                    !game.hasNature(item, "linked") ||
                                    game.countPlayer((cur) => cur.isLinked()) < 2
                                )
                                    return res;
                                //let used = player.getCardUsable('sha') - 1.5, natures = ['thunder', 'fire', 'ice', 'kami'];
                                let uv = player.getUseValue(item, true);
                                if (uv <= 0) return res;
                                let temp = player.getUseValue("sha", true) - uv;
                                if (temp < 0) return res + 0.15;
                                if (temp > 0) return res - 0.15;
                                return res;
                            },
                            result: {
                                target: function (player, target, card, isLink) {
                                    let eff = -1.5,
                                        odds = 1.35,
                                        num = 1;
                                    if (isLink) {
                                        let cache = _status.event.getTempCache("sha_result", "eff");
                                        if (typeof cache !== "object" || cache.card !== ai.getCacheKey(card, true))
                                            return eff;
                                        if (cache.odds < 1.35 && cache.bool) return 1.35 * cache.eff;
                                        return cache.odds * cache.eff;
                                    }
                                    if (
                                        player.hasSkill("jiu") ||
                                        player.hasSkillTag("damageBonus", true, {
                                            target: target,
                                            card: card
                                        })
                                    ) {
                                        if (
                                            target.hasSkillTag("filterDamage", null, {
                                                player: player,
                                                card: card,
                                                jiu: true,
                                            })
                                        )
                                            eff = -0.5;
                                        else {
                                            num = 2;
                                            if (get.attitude(player, target) > 0) eff = -7;
                                            else eff = -4;
                                        }
                                    }
                                    if (
                                        !player.hasSkillTag(
                                            "directHit_ai",
                                            true,
                                            {
                                                target: target,
                                                card: card,
                                            },
                                            true
                                        )
                                    )
                                        odds -=
                                            0.7 *
                                            target.mayHaveShan(
                                                player,
                                                "use",
                                                target.getCards("h", (i) => {
                                                    return i.hasGaintag("sha_notshan");
                                                }),
                                                "odds"
                                            );
                                    _status.event.putTempCache("sha_result", "eff", {
                                        bool: target.hp > num && get.attitude(player, target) > 0,
                                        card: ai.getCacheKey(card, true),
                                        eff: eff,
                                        odds: odds,
                                    });
                                    return odds * eff;
                                },
                            },
                            tag: {
                                respond: 1,
                                respondShan: 1,
                                damage: function (card) {
                                    if (game.hasNature(card, "poison")) return;
                                    return 1;
                                },
                                natureDamage: function (card) {
                                    if (game.hasNature(card, "linked")) return 1;
                                },
                                fireDamage: function (card, nature) {
                                    if (game.hasNature(card, "fire")) return 1;
                                },
                                thunderDamage: function (card, nature) {
                                    if (game.hasNature(card, "thunder")) return 1;
                                },
                                poisonDamage: function (card, nature) {
                                    if (game.hasNature(card, "poison")) return 1;
                                },
                            },
                        },
                        subSkill: {
                            "equip": {
                                audio: "chong_wusheng",
                                trigger: {
                                    player: "useCard1",
                                },
                                forced: true,
                                popup: false,
                                silent: true,
                                firstDo: true,
                                filter: function (event, player) {
                                    return event.card && event.card.name == "sha" && event.cards && event.cards.length == 1 && get.type(event.cards[0]) == "equip";
                                },
                                content: function () {
                                    trigger.baseDamage++;
                                },
                                "_priority": 1,
                            }
                        },
                        "_priority": 0,
                    },
                },
                translate: {
                    [`#${chong_src}/chong_caocao/die:die`]: "霸业未竟，吾心不甘！",
                    "chong_jianxiong": "奸雄",
                    "chong_jianxiong_info": "每当你受到伤害后，你可以获得对你造成伤害的牌，此牌伤害+1，然后摸X张牌（X为此次伤害的伤害点数）",
                    "chong_jianxiong_tag": "雄",
                    [`#${chong_src}/chong_caocao/chong_jianxiong1`]: "奸略逐鹿原，雄才扫狼烟！",
                    [`#${chong_src}/chong_caocao/chong_jianxiong2`]: "鸿鹄大志，几人能懂？",
                    "chong_xieling": "挟令",
                    "chong_xieling_info": "出牌阶段开始时，你可以弃置一张牌，本回合所有人禁止使用或打出该花色的牌，此花色手牌不计入你的手牌上限。若如此做，你摸一张牌",
                    [`#${chong_src}/chong_caocao/chong_xieling1`]: "历史永远由胜利者书写！",
                    [`#${chong_src}/chong_caocao/chong_xieling2`]: "挟天子以令不臣。",
                    "chong_hujia": "护驾",
                    "chong_hujia_info": "主公技，每轮限一次，当你受到有来源的伤害结束后，你选择一名不为伤害来源的魏势力角色，你回复一点体力，其收到伤害来源对其造成的一点伤害",
                    [`#${chong_src}/chong_caocao/chong_hujia1`]: "速来为我殿后！",
                    [`#${chong_src}/chong_caocao/chong_hujia2`]: "拿下刺客，大大有赏！",

                    [`#${chong_src}/chong_liubei/die:die`]: "大汉之一统，朕不复见矣。",
                    "chong_rende": "仁德",
                    "chong_rende_info": "出牌阶段，你可以将任意张手牌交给其他角色。你每给出一张牌获得一个\"仁\"标记",
                    [`#${chong_src}/chong_liubei/chong_rende1`]: "得人心者得天下。",
                    [`#${chong_src}/chong_liubei/chong_rende2`]: "举大事者，必以民为本。",
                    "chong_renze": "仁泽",
                    "chong_renze_info": "回合结束时，你可以令全场手牌数与你相同的角色摸一张牌，若你以此法让除自己以外的角色摸牌，你额外摸一张牌，且获得一个\"仁\"标记",
                    [`#${chong_src}/chong_liubei/chong_renze1`]: "我将丹心酿烈酒，且取一觞慰风尘。",
                    [`#${chong_src}/chong_liubei/chong_renze2`]: "余酒尽倾江海中，与君共宴天下人。",
                    "chong_dewei": "德威",
                    "chong_dewei_info": "每回合限一次，你可以移去两个\"仁\"标记，视为你使用或打出一张基本牌",
                    [`#${chong_src}/chong_liubei/chong_dewei1`]: "仁德之君，则所向披靡也！",
                    [`#${chong_src}/chong_liubei/chong_dewei2`]: "上报国家，下安黎庶。",
                    "chong_jijiang": "激将",
                    "chong_jijiang_info": "主公技，出牌阶段限一次，你可以选择一名蜀势力角色，对你选择的另一名合法目标出杀，否则他给你一张牌",
                    [`#${chong_src}/chong_liubei/chong_jijiang1`]: "国有大难，忠臣良将何在？",
                    [`#${chong_src}/chong_liubei/chong_jijiang2`]: "国将不保，哪位将军请战？",

                    [`#${chong_src}/chong_sunquan/die:die`]: "望孙氏子孙，能护东吴万年基业。",
                    "chong_zhiheng": "制衡",
                    "chong_zhiheng_info": "每回合限一次，你可以弃置任意数量的牌，将其余手牌称为\"衡\"，然后摸以此法弃置数量的牌。当你于本出牌阶段使用或打出\"衡\"时，你摸一张牌。出牌阶段结束时，你失去手牌中\"衡\"的数量的体力",
                    "chong_zhiheng_tag": "衡",
                    [`#${chong_src}/chong_sunquan/chong_zhiheng1`]: "多思多谋，筹谋长远。",
                    [`#${chong_src}/chong_sunquan/chong_zhiheng2`]: "泰然处之，方能大事可成。",
                    "chong_jiuyuan": "救援",
                    "chong_jiuyuan_info": "主公技，每回合限一次，你可以给体力值大于等于你的吴势力角色一张牌，其选择一项，①失去一点体力，②让你回复一点体力",
                    [`#${chong_src}/chong_sunquan/chong_jiuyuan1`]: "得爱卿相救，孤甚感激。",
                    [`#${chong_src}/chong_sunquan/chong_jiuyuan2`]: "东吴俊杰良将在此，岂会败下阵来。",

                    "chong_wusheng": "武圣",
                    "chong_wusheng_info": "你可以将一张红色牌当做【杀】使用或打出。你使用的红色【杀】没有距离限制；锁定技，你使用的由一张装备牌转化的【杀】的伤害值基数+1",
                    [`#${chong_src}/chong_guanyu/chong_wusheng1`]: "金刀烈马，亦能助军威。",
                    [`#${chong_src}/chong_guanyu/chong_wusheng2`]: "挥刀取寇首，千里单骑走。",
                },

            },
            intro: "",
            author: "微禾",
            diskURL: "",
            forumURL: "",
            version: "1.0",
        }, files: { "character": ["chong_guanyu.jpg"], "card": [], "skill": [], "audio": [] }
    }
});