/**
 * addExplanations.ts
 * Non-destructive script — only updates the `explanation` field on existing questions.
 * Safe to run on a live database with existing attempts/users.
 * Run with: npx ts-node prisma/addExplanations.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Map of question content → explanation text
const EXPLANATIONS: Record<string, string> = {
  // ── GRAMMAR: Present tense ─────────────────────────────────────────────────
  'Aš ___ lietuviškai kalbėti.':
    'The 1st person singular (aš) of mokėti ends in -u: moku (I can/know how to). "Mokate" is 2nd plural (jūs), "mokame" is 1st plural (mes). Rule: aš → -u, tu → -i, jis/ji → -a.',
  'Tu ___ labai gerai.':
    'The 2nd person singular (tu) ends in -i for this verb group: tu dainoji (you sing). Compare: aš dainu (I), jis/ji dainoja (he/she), mes dainuojame (we).',
  'Jis ___ banke.':
    'The 3rd person singular (jis = he) ends in -a: dirba (he works). Full pattern: aš dirbu → tu dirbi → jis/ji dirba → mes dirbame → jūs dirbate → jie/jos dirba.',
  'Ji ___ Kaune.':
    'The 3rd person singular (ji = she) of gyventi: gyvena. This is Group 1 conjugation (-a ending): gyvenu/gyveni/gyvena. "Gyvenu" is 1st person (aš), "gyveni" is 2nd person (tu).',
  'Mes ___ kavos.':
    '1st person plural (mes) ends in -ame: geriame (we drink). The -ame ending always marks 1st plural. "Geriu" is aš, "geria" is jis/ji/jie, "geriam" is an informal short form.',
  'Jūs ___ lietuvių kalbos.':
    '"Mokytis" is reflexive (ends in -si/-s). The 2nd person plural (jūs) of reflexive verbs ends in -tės: mokotės. The -si marks reflexive action (learning for yourself).',
  'Jie ___ į parduotuvę.':
    '3rd person plural (jie = they) of eiti: eina. Both singular and plural 3rd person share the same form: jis eina AND jie eina. "Einu" is aš, "einam/einame" is mes.',
  'Aš ___ sriubą.':
    '1st person singular (aš) of valgyti (Group 2, -yti verbs): valgau. Group 2 pattern: aš valgau → tu valgai → jis/ji valgo. Note: 1sg ends in -au (not -u like Group 1).',
  'Tu ___ knygą.':
    '2nd person singular (tu) of skaityti: skaitai. Group 2 pattern: aš skaitau → tu skaitai → jis/ji skaito. The -ai ending marks 2nd person singular in this group.',
  'Mes ___ laikraštį rytais.':
    '1st person plural (mes) of skaityti: skaitome. Group 2 plural: mes skaitome → jūs skaitote → jie/jos skaito. "Skaitau" is aš, "skaito" is 3rd person.',

  // ── GRAMMAR: Past tense ────────────────────────────────────────────────────
  'Vakar aš ___ su draugu.':
    '"Vakar" (yesterday) signals past tense. 1st person singular past of kalbėti: kalbėjau. Past pattern: kalbėjau → kalbėjai → kalbėjo → kalbėjome. The -jau ending marks 1sg past for -ėti verbs.',
  'Jis praeitą savaitę ___ daug.':
    '"Praeitą savaitę" (last week) = past tense. 3rd person singular past (jis): dirbo. Group 1 past: dirbau → dirbai → dirbo → dirbome. The -o ending marks 3rd person past.',
  'Mes vakar ___ į kiną.':
    'Past tense 1st plural (mes): ėjome. Eiti (to go) has an irregular past tense — the stem changes completely: present eina → past ėjo. Pattern: ėjau → ėjai → ėjo → ėjome → ėjote → ėjo.',
  'Tu vakar ___ pietus namuose?':
    '2nd person singular past (tu): valgei. Group 2 past: valgiau → valgei → valgė. The -ei ending marks 2nd person past. "Valgiau" = aš, "valgė" = jis/ji.',
  'Jie praeitą mėnesį ___ po Europą.':
    '3rd person past of keliauti (to travel): keliavo. The -auti/-uoti verbs have a special past tense pattern with -av-: keliavau → keliavai → keliavo. Both 3rd sg and pl use "keliavo".',
  'Ji vakar ___ knygą.':
    '3rd person singular past (ji): skaitė. Group 2 past ends in -ė for 3rd person: skaičiau → skaitei → skaitė. Note: 1sg is "skaičiau" (t softens to č before -iau).',
  'Aš vakar ___ naujus batus.':
    '1st person singular past (aš) of pirkti: pirkau. Group 1 past: pirkau → pirkai → pirko → pirkome. "Pirko" is 3rd person, not 1st. The -au ending marks 1sg past.',
  'Jūs praeitą savaitę ___ lietuvių kalbos?':
    '2nd person plural past of reflexive mokytis: mokėtės. The -tės ending marks reflexive 2nd plural past. Compare present: mokotės → past: mokėtės.',
  'Mes pernai ___ Kaune.':
    '1st person plural past (mes) of gyventi: gyvenome. Group 1 past plural: gyvenome → gyvenote → gyveno. "Gyveno" is 3rd person, "gyvenau" is 1sg.',
  'Vakar jis ___ vėlai.':
    '3rd person past (jis) of ateiti (to arrive/come): atėjo. Compound verbs with "at-" follow the same irregular pattern as eiti: atėjau → atėjai → atėjo. "Vakar" signals past tense.',

  // ── GRAMMAR: Future tense ──────────────────────────────────────────────────
  'Rytoj aš ___ į Vilnių.':
    '"Rytoj" (tomorrow) signals future tense. 1st person singular future: važiuosiu. Lithuanian future uses -s- infix: važiuosiu → važiuosi → važiuos → važiuosime → važiuosite → važiuos.',
  'Kitą savaitę jis ___ naujame biure.':
    '3rd person future (jis): dirbs. Future pattern: dirbsiu → dirbsi → dirbs → dirbsime → dirbsite → dirbs. Both 3sg and 3pl share "dirbs". "Kitą savaitę" (next week) = future.',
  'Mes rytoj ___ į turgų.':
    '1st person plural future (mes): eisime. Eiti future: eisiu → eisi → eis → eisime → eisite → eis. Both 3rd person forms use "eis".',
  'Tu rytoj ___ pusryčius namuose?':
    '2nd person singular future (tu): valgysi. Future: valgysiu → valgysi → valgys. The -si ending marks 2nd person singular future. "Rytoj" = future tense.',
  'Jie rytoj ___ iš Lenkijos.':
    '3rd person future (jie/jos): atvyks. Both singular and plural 3rd person share the same future form: jis atvyks AND jie atvyks. This is a key feature of Lithuanian future tense.',

  // ── GRAMMAR: Kilmininkas (genitive) ────────────────────────────────────────
  'Aš neturiu ___ (knyga).':
    'Negation triggers the genitive case (kilmininkas). "Neturiu" (I don\'t have) requires genitive: knyga → knygos. Rule: affirmative uses accusative "knygą", but negation shifts it to genitive "knygos". Ask: ko? (of what?).',
  'Jis nupirko daug ___ (obuolys).':
    'Quantity words like "daug" (many/much), "mažai" (few), "kiek" (how many) always require genitive plural. Obuolys (apple) → genitive plural: obuolių. This is a fixed grammar rule: daug + genitive plural.',
  'Man trūksta ___ (laikas).':
    'The verb "trūksta" (there is a lack of / is missing) always governs genitive: laikas → laiko (genitive singular). Ask "ko trūksta?" (what is lacking?). Masculine -as nouns: genitive singular = -o.',
  'Jie neturi ___ (pinigai).':
    'Negation with "neturi" (they don\'t have) requires genitive: pinigai → pinigų (genitive plural). Masculine plural -ai nouns: genitive plural = -ų. Compare: accusative plural would be "pinigus".',
  'Ji negeria ___ (kava).':
    'Negation rule: "negeria" (doesn\'t drink) changes the object from accusative to genitive. Kava (nominative) → kavos (genitive). Feminine -a nouns: genitive = -os. Affirmative: geria kavą (accusative).',

  // ── GRAMMAR: Galininkas (accusative) ──────────────────────────────────────
  'Aš skaitau ___ (knyga).':
    'The direct object of a transitive verb takes the accusative (galininkas). "Skaitau" (I read) is transitive: knyga → knygą. Rule: feminine nouns in -a form accusative by adding -ą. Ask: ką? (what?).',
  'Jis perka ___ (automobilis).':
    '"Perka" (buys) is transitive — its object takes accusative. Automobilis (masculine -is noun) → accusative: automobilį (-is → -į). Ask: ką? The -į ending marks masculine accusative for -is nouns.',
  'Mes matome ___ (medis).':
    '"Matome" (we see) takes a direct object in accusative. Medis (tree, masculine -is noun) → accusative: medį. Note: the stem changes (medis → medį, but medžio in genitive). Ask: ką matome?',
  'Ji valgo ___ (obuolys).':
    '"Valgo" (eats) takes accusative. Obuolys (apple, masculine -ys noun) → accusative: obuolį (-ys → -į). The -į ending is the standard accusative for masculine nouns ending in -is/-ys.',
  'Aš myliu ___ (mama).':
    '"Myliu" (I love) is transitive — takes accusative. Mama → mamą (-a → -ą). All feminine nouns ending in -a form accusative by replacing -a with -ą. Ask: ką myliu? → mamą.',

  // ── GRAMMAR: Naudininkas (dative) ─────────────────────────────────────────
  'Aš pasakiau ___ (draugas).':
    'The dative case (naudininkas) marks the indirect object — to/for whom. "Pasakiau" (I told) — told to whom? Draugas → draugui (-as → -ui). Ask: kam? (to whom?). Dative of -as nouns: -ui.',
  'Ji duoda ___ (vaikas) saldainį.':
    '"Duoda" (gives) requires dative for the recipient: vaikas → vaikui (-as → -ui). The saldainį (sweet) is the direct object (accusative), while vaikui is the indirect object (dative). Ask: kam duoda?',
  'Mes rašome ___ (mama) laišką.':
    'Dative of feminine mama: mamai (-a → -ai). "Rašome laišką" — we write a letter to whom? mamai (to mum). Feminine -a nouns form dative with -ai. Ask: kam rašome?',
  'Jis sako ___ (studentai) apie egzaminą.':
    'Dative plural: studentai → studentams (-ai → -ams). "Sako" (says/tells) — tells to whom? To the students (plural dative). Rule: masculine plural dative always ends in -ams.',
  'Ji padovanojo ___ (sesuo) knygą.':
    'Sesuo (sister) is an irregular noun with stem changes: nominative sesuo, but dative seseriai. It belongs to the -uo declension: sesuo → sesers (gen) → seseriai (dat) → seserį (acc). Must be memorised.',

  // ── GRAMMAR: Vietininkas (locative) ───────────────────────────────────────
  'Aš gyvenu ___ (miestas).':
    'The locative case (vietininkas) expresses location — where something is or happens. "Gyvenu" (I live) kur? Miestas → mieste (-as → -e). Masculine -as nouns: locative = -e. Ask: kur?',
  'Knyga yra ___ (stalas).':
    '"Yra" (is) with location uses locative. Stalas → stale (-as → -e). "Knyga yra stale" = the book is in/on the table. Compare: ant stalo (on top of the table, genitive) vs stale (inside the table/desk).',
  'Jis dirba ___ (mokykla).':
    'Location of work uses locative: mokykla → mokykloje (-a → -oje). Feminine -a nouns: locative = -oje. "Dirba kur?" → mokykloje. Compare: accusative mokyklą (direction: into school) vs locative mokykloje (location: at school).',
  'Mes esame ___ (parduotuvė).':
    'Locative of parduotuvė (shop): parduotuvėje (-ė → -ėje). Feminine -ė nouns: locative = -ėje. "Esame kur?" → parduotuvėje. The -ėje ending is the locative marker for this noun type.',
  'Ji mokosi ___ (universitetas).':
    'Locative of universitetas: universitete (-as → -e). "Mokosi kur?" → universitete. Masculine -as nouns always form locative with -e. Compare: genitive universiteto (of the university) vs locative universitete (at the university).',

  // ── GRAMMAR: Adjective agreement ──────────────────────────────────────────
  'Jis yra ___ mokinys.':
    'Adjectives must agree with the noun in gender, case, and number. "Mokinys" is masculine nominative → adjective must be masculine nominative: geras. "Gera" is feminine nominative. Rule: masculine nominative adjectives end in -as/-us/-is.',
  'Ji perka ___ suknelę.':
    '"Perka" (buys) takes accusative: suknelę (feminine accusative). The adjective must also be feminine accusative: nauja (nominative) → naują (accusative, -a → -ą). Adjectives follow the same case endings as the noun they describe.',
  'Aš turiu ___ šunį.':
    '"Turiu" takes accusative. Šuo/šunis (dog) accusative: šunį (masculine). Adjective didelis (big) in masculine accusative: didelį (-is → -į). The adjective mirrors the noun ending exactly.',
  'Jie gyvena ___ name.':
    'Locative masculine: namas → name. Adjective must be masculine locative: gražus → gražiame (-us → -iame). The -iame ending is the masculine locative for -us adjectives. "Gražiam" is dative.',
  'Mes matome ___ kalną.':
    'Accusative masculine: kalnas → kalną. Adjective aukštas (tall/high) in masculine accusative: aukštą (-as → -ą). The adjective ends in -ą just like the noun kalną.',
  'Ji nešioja ___ suknelę.':
    'Accusative feminine: suknelę. Adjective raudonas/raudona (red) in feminine accusative: raudoną (-a → -ą). Feminine adjectives in accusative always end in -ą, matching the noun ending.',
  'Aš noriu ___ obuolio.':
    '"Noriu" (I want) governs genitive: obuolys → obuolio. The adjective must also be genitive masculine: didelis → didelio (-is → -io). Both the noun and adjective must be in the same case: genitive.',
  'Tai yra ___ miestas.':
    '"Miestas" is masculine nominative. After "yra" (is) in a naming/describing sentence, the predicate adjective is nominative: gražus. The -us ending marks masculine nominative for this adjective type.',
  'Jis turi ___ katę.':
    '"Turi" takes accusative. Katė (cat) is feminine, accusative: katę (-ė → -ę). The feminine form of juodas is juoda, and its accusative is juodą (-a → -ą). The adjective agrees with the feminine noun.',
  'Mes valgome ___ duoną.':
    'Accusative feminine: duona → duoną. Adjective šviežias (fresh) in feminine accusative: šviežią (-ias → -ią). For -ias adjectives, feminine accusative drops -ias and adds -ią. Adjective agrees with the noun duoną.',

  // ── GRAMMAR: Pronouns ──────────────────────────────────────────────────────
  '___ esu studentas.':
    'The verb form "esu" is exclusively 1st person singular → subject must be "aš" (I). Each person has a unique verb form: aš esu, tu esi, jis/ji yra, mes esame, jūs esate, jie/jos yra.',
  'Ar ___ kalbate lietuviškai?':
    '"Kalbate" is 2nd person plural → subject is "jūs" (you plural/formal). Conjugation: aš kalbu, tu kalbi, jis/ji kalba, mes kalbame, jūs kalbate. The -ate ending always marks 2nd person plural.',
  'Kur yra ___ knyga? (jo)':
    'The hint "(jo)" tells you the answer. "Jo" is the genitive of "jis" (he), used as a possessive: his book = jo knyga. Possessives: mano (my), tavo (your), jo (his), jos (her), mūsų (our), jūsų (your pl.), jų (their).',
  'Aš daviau ___ laišką. (jai)':
    'The hint "(jai)" tells you the answer. "Jai" is the dative of "ji" (she): to her. "Daviau jai" = I gave to her. Dative pronouns: man (to me), tau (to you), jam (to him), jai (to her), mums (to us), jums (to you pl.).',
  '___ esame čia kartu.':
    '"Esame" is 1st person plural → subject is "mes" (we). Būti conjugation: aš esu, tu esi, jis/ji yra, mes esame, jūs esate, jie/jos yra. The -ame ending marks 1st person plural.',
  'Tai yra ___ namas. (mūsų)':
    'The hint "(mūsų)" tells you the answer. "Mūsų" is the genitive of "mes" (we), used as a possessive: our house = mūsų namas. Possessives do NOT change form by case — mūsų namas, mūsų namo, mūsų namui all use "mūsų".',
  'Ar ___ supranti lietuviškai?':
    '"Supranti" is 2nd person singular → subject is "tu" (you singular). Conjugation: aš suprantu, tu supranti, jis/ji supranta. The -i ending (specifically -nti here) marks 2nd person singular.',
  'Ji pasakė ___ apie tai. (man)':
    'The hint "(man)" tells you the answer. "Man" is the dative of "aš" (I): to me. "Pasakė man" = she told me. The dative of personal pronouns: man/tau/jam/jai/mums/jums/jiems/joms.',

  // ── GRAMMAR: Prepositions ──────────────────────────────────────────────────
  'Aš einu ___ parduotuvę.':
    '"Į" (into/to) with accusative indicates movement toward a place. "Einu į parduotuvę" = I am going to the shop. Key rule: į + accusative = direction of movement. Compare: "iš" (from) shows departure.',
  'Jis ateina ___ mokyklos.':
    '"Iš" (from/out of) with genitive indicates origin or departure. "Ateina iš mokyklos" = comes from school. Rule: iš + genitive = movement away from. "Į mokyklą" (to school) vs "iš mokyklos" (from school).',
  'Knyga yra ___ stalo.':
    '"Ant" (on top of) with genitive indicates position on a surface. "Knyga ant stalo" = the book is on the table. Rule: ant + genitive. Compare: "po stalu" (under the table), "prie stalo" (at the table).',
  'Mes sėdime ___ stalo.':
    '"Prie" (next to/at/by) with genitive indicates proximity or position near something. "Sėdime prie stalo" = we sit at the table. Rule: prie + genitive. "Ant stalo" = on the table (surface contact).',
  'Autobusas atvyksta ___ Kauno.':
    '"Iš" + genitive = from (point of origin). "Atvyksta iš Kauno" = arrives from Kaunas. Rule: direction FROM uses "iš" + genitive. Direction TO uses "į" + accusative: "atvyksta į Vilnių" (arrives in Vilnius).',
  'Jis gyvena ___ Vilniaus.':
    '"Netoli" (not far from/near) + genitive indicates proximity to a place. "Gyvena netoli Vilniaus" = lives near Vilnius. Other proximity prepositions: šalia (next to), prie (by), aplink (around) — all take genitive.',
  'Vaikai žaidžia ___ namo.':
    '"Šalia" (next to/beside/alongside) + genitive indicates being beside something. "Žaidžia šalia namo" = play beside the house. Compare: "prie namo" (by the house/at the door) vs "šalia namo" (alongside the house).',

  // ── GRAMMAR: Question words ────────────────────────────────────────────────
  '___ tavo vardas?':
    '"Koks" (what/which kind, masculine) is used with masculine nouns when asking about identity or quality. "Vardas" is masculine → "Koks tavo vardas?" (What is your name?). Feminine version: "Kokia tavo pavardė?" (What is your surname?).',
  '___ tu gyveni?':
    '"Kur" (where) asks about location. "Kur tu gyveni?" = Where do you live? Other question words: kas (who/what), kada (when), kiek (how much/many), koks (what kind), kaip (how).',
  '___ prasideda filmas?':
    '"Kada" (when) asks about time. "Kada prasideda filmas?" = When does the film start? Lithuanian question words: kas (who/what), kur (where), kada (when), kiek (how much), kaip (how), kodėl (why).',
  '___ kainuoja bilietas?':
    '"Kiek" (how much/how many) asks about price, quantity, or amount. "Kiek kainuoja bilietas?" = How much does the ticket cost? Also used for age: "Kiek tau metų?" (How old are you?).',
  '___ tu dirbi?':
    '"Kur" (where) asks about the location of an action. "Kur tu dirbi?" = Where do you work? Use "kur" for locations and directions. Compare: "Kada dirbi?" (When do you work?) vs "Kur dirbi?" (Where do you work?).',

  // ── WRITING W1_FILL ────────────────────────────────────────────────────────
  '1 užduotis (W1). Įrašykite trūkstamą žodį į tarpą [1].':
    '"Šį" is the accusative masculine of "šis" (this). Time expressions in Lithuanian use the accusative: šį vakarą (this evening), šį rytą (this morning), šią savaitę (this week). "Šį" agrees with "vakarą" (masculine accusative).',
  '1 užduotis (W1). Įrašykite trūkstamą žodį į tarpą [2].':
    '"Išgerti" is the infinitive of "išgerti" (to have a drink). After "nori" (wants), Lithuanian uses an infinitive: nori išgerti = wants to drink. The genitive "kavos" that follows means "some coffee" — after the infinitive of a drink/eat verb, genitive expresses a partial amount.',
  '1 užduotis (W1). Įrašykite trūkstamą žodį į tarpą [3].':
    '"Miesto" is the genitive of "miestas" (city/town). The phrase "miesto centre" = in the city centre. In Lithuanian, "centre" (centre) is modified by a genitive noun: miesto (of the city). This is a very common fixed phrase.',
  '1 užduotis (W1). Įrašykite trūkstamą žodį į tarpą [4].':
    '"Yra" is the 3rd person singular/plural present of "būti" (to be). "Ten yra labai gera kavinė" = there is a very good café there. "Yra" is the only form used for 3rd person — the same for jis yra, ji yra, jie yra.',
  '1 užduotis (W1). Įrašykite trūkstamą žodį į tarpą [5].':
    '"Mielai" is an adverb meaning "gladly / with pleasure". "Mielai sutinku!" = I gladly agree! This is a common polite expression when accepting an invitation in Lithuanian. It comes from the adjective "mielas" (dear/pleasant).',
  '1 užduotis (W1). Įrašykite trūkstamą žodį į tarpą [6].':
    '"Mes" (we) is the 1st person plural subject pronoun. "Kelintą valandą mes susitinkame?" = At what time are we meeting? The subject "mes" is often omitted in everyday speech since the verb ending (-ame) already signals 1st plural, but it can be added for clarity or emphasis.',

  // ── WRITING W2_SELECT ──────────────────────────────────────────────────────
  '2 užduotis (W2). Pasirinkite tinkamą žodį tarpui [1].':
    '"Atidaroma" is the passive present tense (esamojo laiko pasyvas). The sentence means "a new café is being opened". The passive is needed here because the café is being opened by someone (an implied agent). "Atidaryta" is past passive; "atidarė" is active past ("opened"); "atveria" means "opens" (active, different verb).',
  '2 užduotis (W2). Pasirinkite tinkamą žodį tarpui [2].':
    '"Kavos" (genitive of kava = coffee) is the only contextually correct answer — the café is called "Kava" (Coffee). Also grammatically, after "atsigerti" (to have a drink of), the genitive case is required: atsigerti kavos (to have some coffee). All options are grammatically correct genitive forms, but only kavos fits the context.',
  '2 užduotis (W2). Pasirinkite tinkamą žodį tarpui [3].':
    '"Jauki" (cosy, warm) fits because the sentence describes the café positively alongside "šviesi" (bright/light). The adjective must be feminine to agree with "kavinė" (feminine noun). "Jauki" is feminine nominative of "jaukus". The pairing "jauki ir šviesi" creates a welcoming image.',
  '2 užduotis (W2). Pasirinkite tinkamą žodį tarpui [4].':
    '"Šioje" is the locative of "ši" (this, feminine demonstrative), agreeing with "kavinėje" (locative). "Šioje kavinėje" = in this café. The locative -oje ending on the noun requires a matching demonstrative also in locative. "Šioje" is the correct locative feminine form of "šis/ši".',
  '2 užduotis (W2). Pasirinkite tinkamą žodį tarpui [5].':
    '"Šviežių" (fresh, genitive plural) is the correct choice contextually — fresh bread rolls are a selling point. Grammatically, "nusipirkti" (to buy) with an indefinite quantity uses genitive: nusipirkti šviežių bandelių = to buy some fresh rolls. The genitive plural of "šviežias" is "šviežių".',
  '2 užduotis (W2). Pasirinkite tinkamą žodį tarpui [6].':
    '"Patiks" is the future tense of "patikti" (to please / to like). "Tikimės, kad jums patiks" = We hope you will like (coming to us). The future tense is required because this is a hope about something that has not yet happened. "Patiko" is past (already liked); "nepatinka" is negative present.',
};

async function main() {
  let updated = 0;
  let skipped = 0;

  for (const [content, explanation] of Object.entries(EXPLANATIONS)) {
    const result = await prisma.question.updateMany({
      where: { content },
      data: { explanation },
    });
    if (result.count > 0) {
      updated += result.count;
    } else {
      skipped++;
      console.warn(`  ⚠️  No question found for: "${content.slice(0, 60)}..."`);
    }
  }

  console.log(`\n✅ Done! Updated ${updated} question(s). Skipped ${skipped} unmatched content strings.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
