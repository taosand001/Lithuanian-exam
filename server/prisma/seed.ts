import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

type Opt = { content: string; isCorrect: boolean; order: number };

async function createQ(params: {
  examId: string;
  content: string;
  type: string;
  skill: string;
  order: number;
  opts: Opt[];
  passage?: string;
  taskType?: string;
  variantSet?: string;
  explanation?: string;
}) {
  const { opts, ...rest } = params;
  await prisma.question.create({ data: { ...rest, options: { create: opts } } });
}

const LL = ['A','B','C','D','E','F','G','H'];

function labeled(texts: string[], ci: number): Opt[] {
  return texts.map((t, i) => ({ content: `${LL[i]}: ${t}`, isCorrect: i === ci, order: i }));
}

function simple(texts: string[], ci: number): Opt[] {
  return texts.map((t, i) => ({ content: t, isCorrect: i === ci, order: i }));
}

function tf(isTrue: boolean): Opt[] {
  return [
    { content: 'Teisingas', isCorrect: isTrue, order: 0 },
    { content: 'Neteisingas', isCorrect: !isTrue, order: 1 },
  ];
}

function notices(correct: 'A' | 'B' | 'C'): Opt[] {
  return ['A','B','C'].map((l, i) => ({ content: l, isCorrect: l === correct, order: i }));
}

async function main() {
  await prisma.option.deleteMany();
  await prisma.attemptAnswer.deleteMany();
  await prisma.examAttempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@ltegzaminai.lt',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
    },
  });

  const a2 = await prisma.exam.create({
    data: {
      title: 'Valstybines lietuviu kalbos A2 egzaminas',
      titleEn: 'Lithuanian Language A2 State Exam',
      description: 'Oficialus A2 lygio valstybiniu lietuviu kalbos egzaminas',
      level: 'A2',
      category: 'LANGUAGE',
      timeLimit: 90,
      passingScore: 60,
      isPublished: true,
    },
  });

  const con = await prisma.exam.create({
    data: {
      title: 'Lietuvos Respublikos Konstitucijos egzaminas',
      titleEn: 'Lithuanian Constitution Exam',
      description: 'Konstitucijos ir pilietybes egzaminas',
      level: 'CONSTITUTION',
      category: 'CONSTITUTION',
      timeLimit: 45,
      passingScore: 70,
      isPublished: true,
    },
  });

  const eId = a2.id;
  const cId = con.id;

  // ============================================================
  // READING A — Stoteliu pakeitimas savaitgali (bus/transport)
  // ============================================================

  // P1 reading_A: 6 questions orders 1-6, 8 shared options
  {
    const opts8 = [
      'Autobusas Nr. 5 vaziuoja kas 15 minuciu.',
      'Bilietas kainuoja 1 euro 30 centu.',
      'Galite persesti stoteleje Katedral aikste.',
      'Autobusas atvyksta paskutinis 23:00 valanda.',
      'Kelione trunka apie 20 minuciu.',
      'Bilieta galite nusipirkti autobuse arba kioske.',
      'Stotelė yra už kampo, kairėje pusėje.',
      'Taip, šis autobusas važiuoja per centrą.',
    ];
    const passage = 'Keleiviu klausimai informacijos punkte';
    const qs: [string, number][] = [
      ['Kaip dažnai važiuoja autobusas Nr. 5 į miesto centrą?', 0],
      ['Kiek kainuoja vienas bilietas?', 1],
      ['Kaip man nuvažiuoti iki oro uosto persėdant?', 2],
      ['Iki kada važiuoja paskutinis autobusas vakare?', 3],
      ['Kiek laiko užtrunka kelionė iki geležinkelio stoties?', 4],
      ['Kur galiu nusipirkti autobuso bilietą?', 5],
    ];
    for (let i = 0; i < qs.length; i++) {
      await createQ({ examId: eId, content: qs[i][0], type: 'MULTIPLE_CHOICE', skill: 'READING',
        order: i + 1, passage, taskType: 'P1_MATCH', variantSet: 'reading_A',
        opts: labeled(opts8, qs[i][1]) });
    }
  }

  // P2 reading_A: 5 questions orders 7-11, 7 shared terms
  {
    const terms7 = ['Maršrutas','Stotelė','Bilietas','Tvarkaraštis','Persėdimas','Greitasis autobusas','Mėnesinis bilietas'];
    const qs: [string, number][] = [
      ['Dokumentas, kurį reikia turėti norint važiuoti autobusu ar traukiniu.', 2],
      ['Vieta, kur autobusas sustoja ir keleiviai gali įlipti arba išlipti.', 1],
      ['Autobuso važiavimo kelias nuo vienos stotelės iki kitos.', 0],
      ['Keleivio perėjimas iš vieno autobuso į kitą tęsiant kelionę.', 4],
      ['Dokumentas, leidžiantis neribotai važiuoti visą mėnesį.', 6],
    ];
    for (let i = 0; i < qs.length; i++) {
      await createQ({ examId: eId, content: qs[i][0], type: 'MULTIPLE_CHOICE', skill: 'READING',
        order: i + 7, taskType: 'P2_DEF_MATCH', variantSet: 'reading_A',
        opts: labeled(terms7, qs[i][1]) });
    }
  }

  // P3 reading_A: 5 questions orders 12-16, 6 shared phrases (F is extra)
  {
    const p3pass = `K: Laba diena! [12]
D: Laba diena! Žinoma. Autobusas Nr. 10 važiuoja kaip tik ten.
K: Labai gerai. [13]
D: Bilietą galite nusipirkti kioske arba pas vairuotoją.
K: Supratau. Ar žinote, kada atvyksta kitas autobusas?
D: [14]
K: Ačiū. O kiek laiko trunka kelionė?
D: [15]
K: Labai ačiū už pagalbą!
D: Prašom! [16]`;
    const phrases6 = [
      'Man reikia nuvažiuoti iki Katedros aikštės.',
      'Kur galiu nusipirkti bilietą?',
      'Autobusas atvyksta kas dešimt minučių.',
      'Kelionė trunka apie dvidešimt minučių.',
      'Geros kelionės!',
      'Ar čia sustoja autobusas Nr. 10?',
    ];
    const answers = [0,1,2,3,4];
    for (let i = 0; i < 5; i++) {
      await createQ({ examId: eId, content: `Pasirinkite frazę vietai [${i+12}] dialoge`,
        type: 'MULTIPLE_CHOICE', skill: 'READING', order: i + 12, passage: p3pass,
        taskType: 'P3_DIALOGUE', variantSet: 'reading_A',
        opts: labeled(phrases6, answers[i]) });
    }
  }

  // P4 reading_A: 6 questions orders 17-22, TRUE/FALSE
  {
    const p4pass = `Dėl savaitgalio remonto darbų nuo lapkričio 5 d. iki lapkričio 7 d. autobuso Nr. 15 maršrutas bus pakeistas. Autobusas nevažiuos per Gedimino prospektą. Vietoj to jis važiuos per Pylimo gatvę. Stotelė "Muziejus" bus laikinai uždaryta. Keleiviai gali naudotis stotelėmis "Parkas" ir "Paštas", kurios yra netoliese. Papildomos informacijos rasite interneto puslapyje arba galite skambinti informacijos numeriu.`;
    const qs: [string, boolean][] = [
      ['Autobuso Nr. 15 maršrutas keičiamas dėl remonto darbų.', true],
      ['Maršruto pakeitimai galioja visą mėnesį.', false],
      ['Autobusas važiuos per Pylimo gatvę.', true],
      ['Stotelė "Parkas" bus laikinai uždaryta.', false],
      ['Keleiviai gali skambinti norėdami gauti daugiau informacijos.', true],
      ['Autobusas išliks važiuoti per Gedimino prospektą.', false],
    ];
    for (let i = 0; i < qs.length; i++) {
      await createQ({ examId: eId, content: qs[i][0], type: 'TRUE_FALSE', skill: 'READING',
        order: i + 17, passage: p4pass, taskType: 'P4_TRUE_FALSE', variantSet: 'reading_A',
        opts: tf(qs[i][1]) });
    }
  }

  // P5 reading_A: 6 questions orders 23-28, 3 notices
  {
    const p5pass = `§A§ AUTOBUSU STOTIES BILIETU KASA\nDirbame: I-V 7:00-20:00, VI-VII 8:00-18:00\nParduodame vienkartinius ir menesiniusbilietus.\nInformacija: tel. 1822\n§B§ TAKSI PASLAUGOS "GREITAS"\nVaziuojame visa para, 7 dienas per savaite\nRezervacija telefonu arba progamele\nGrupiniai marsrutai - specialios kainos\n§C§ NUOMOS PUNKTAS "DVIRATIS"\nDviraciu nuoma nuo 2 euru per valanda\nDirbame: VII 10:00-20:00\nReikalingas asmens dokumentas`;
    const qs: [string, 'A'|'B'|'C'][] = [
      ['Kur galima nusipirkti mėnesinį bilietą?', 'A'],
      ['Kurioje vietoje galima gauti transporto paslaugą naktį?', 'B'],
      ['Kur reikia pateikti asmens dokumentą?', 'C'],
      ['Kuri paslauga dirba visą parą visą savaitę?', 'B'],
      ['Kur galima sužinoti daugiau informacijos paskambinus numeriu 1822?', 'A'],
      ['Kur galima naudotis grupinėmis kainomis?', 'B'],
    ];
    for (let i = 0; i < qs.length; i++) {
      await createQ({ examId: eId, content: qs[i][0], type: 'MULTIPLE_CHOICE', skill: 'READING',
        order: i + 23, passage: p5pass, taskType: 'P5_NOTICES', variantSet: 'reading_A',
        opts: notices(qs[i][1]) });
    }
  }

  // ============================================================
  // READING B — Viesbutio paslaugos (hotel services)
  // ============================================================

  // P1 reading_B
  {
    const opts8 = [
      'Viešbutis turi baseiną ir sporto salę.',
      'Pusryčiai įskaičiuoti į kambario kainą.',
      'Išsiregistruoti reikia iki 12:00 valandos.',
      'Galite palikti bagažą registratūroje.',
      'Kambarys kainuoja 80 eurų per naktį.',
      'Nemokamas Wi-Fi visame viešbutyje.',
      'Restoranas dirba nuo 7:00 iki 22:00.',
      'Taip, galime iškviesti taksi jums.',
    ];
    const passage = 'Svečių klausimai viešbučio registratūroje';
    const qs: [string, number][] = [
      ['Ar viešbutyje yra sporto galimybių?', 0],
      ['Ar pusryčiai yra įtraukti į kambario kainą?', 1],
      ['Iki kada turiu išsiregistruoti iš kambario?', 2],
      ['Kur galiu palikti savo lagaminą?', 3],
      ['Kiek kainuoja kambarys vienai nakčiai?', 4],
      ['Ar galite padėti man iškviesti taksi?', 7],
    ];
    for (let i = 0; i < qs.length; i++) {
      await createQ({ examId: eId, content: qs[i][0], type: 'MULTIPLE_CHOICE', skill: 'READING',
        order: i + 1, passage, taskType: 'P1_MATCH', variantSet: 'reading_B',
        opts: labeled(opts8, qs[i][1]) });
    }
  }

  // P2 reading_B
  {
    const terms7 = ['Registratūra','Kambarys','Išsiregistravimas','Rezervacija','Pusryčiai','Aptarnavimas','Paros kaina'];
    const qs: [string, number][] = [
      ['Vieta viešbutyje, kur svečiai atvyksta ir gauna kambario raktą.', 0],
      ['Kambario užsakymas iš anksto telefonu arba internetu.', 3],
      ['Ryto valgis, kuris dažnai įtraukiamas į viešbučio kainą.', 4],
      ['Procedūra, kurią svečias atlieka prieš išvykdamas iš viešbučio.', 2],
      ['Suma, kurią mokate už vieną nakvynę viešbutyje.', 6],
    ];
    for (let i = 0; i < qs.length; i++) {
      await createQ({ examId: eId, content: qs[i][0], type: 'MULTIPLE_CHOICE', skill: 'READING',
        order: i + 7, taskType: 'P2_DEF_MATCH', variantSet: 'reading_B',
        opts: labeled(terms7, qs[i][1]) });
    }
  }

  // P3 reading_B
  {
    const p3pass = `K: Laba diena! [12]
D: Laba diena! Taip, turime laisvų kambarių. Ar turite rezervaciją?
K: Taip. [13]
D: Labai gerai, pone Petrauskai. [14]
K: Prašom. (atiduoda dokumentą)
D: Ačiū. Čia jūsų kambario raktas. [15]
K: [16]
D: Pusryčiai patiekiami nuo 7:00 iki 10:30 ryto restorane.
K: Ačiū labai!`;
    const phrases6 = [
      'Ar turite laisvų kambarių šiai nakčiai?',
      'Rezervacija yra Petrausko vardu.',
      'Prašau jūsų asmens dokumento.',
      'Kambarys numeris 305, penktame aukšte.',
      'Iki kokio laiko patiekiami pusryčiai?',
      'Ar yra nemokamas internetas?',
    ];
    const answers = [0,1,2,3,4];
    for (let i = 0; i < 5; i++) {
      await createQ({ examId: eId, content: `Pasirinkite frazę vietai [${i+12}] dialoge`,
        type: 'MULTIPLE_CHOICE', skill: 'READING', order: i + 12, passage: p3pass,
        taskType: 'P3_DIALOGUE', variantSet: 'reading_B',
        opts: labeled(phrases6, answers[i]) });
    }
  }

  // P4 reading_B
  {
    const p4pass = `Mieli svečiai! Informuojame, kad viešbučio restoranas šį savaitgalį dirbs sutrumpintu laiku. Šeštadienį restoranas dirbs nuo 8:00 iki 20:00. Sekmadienį – nuo 9:00 iki 18:00. Pusryčiai abu dienas bus patiekiami nuo 8:00 iki 10:30. Viešbučio baseinas šį savaitgalį bus uždarytas dėl techninių darbų. Sporto salė dirbs įprastu laiku. Jeigu turėsite klausimų, kreipkitės į registratūrą.`;
    const qs: [string, boolean][] = [
      ['Restoranas šį savaitgalį dirbs trumpiau nei paprastai.', true],
      ['Šeštadienį restoranas dirbs iki 22:00.', false],
      ['Pusryčiai patiekiami iki 10:30.', true],
      ['Baseinas bus atidarytas visą savaitgalį.', false],
      ['Sporto salė šį savaitgalį neveiks.', false],
      ['Svečiai gali kreiptis į registratūrą dėl informacijos.', true],
    ];
    for (let i = 0; i < qs.length; i++) {
      await createQ({ examId: eId, content: qs[i][0], type: 'TRUE_FALSE', skill: 'READING',
        order: i + 17, passage: p4pass, taskType: 'P4_TRUE_FALSE', variantSet: 'reading_B',
        opts: tf(qs[i][1]) });
    }
  }

  // P5 reading_B
  {
    const p5pass = `§A§ SPA IR BASEINAS\nDarbo laikas: 7:00-22:00 (I-VII)\nRezervacija reikalinga savaitgaliais\nVaikams iki 12 metu - 50% nuolaida\nTel: (8-5) 212 3456\n§B§ VIESBUTIO RESTORANAS "AZUOLAS"\nPusryciai: 7:00-10:30\nPietūs: 12:00-15:00\nVakariene: 18:00-22:00\nVegetariski patiekalai - kasdien\n§C§ SKALBYKLA\nSkabinium paemimas iki 10:00\nSkabiniai paruosti per 24 valandas\nKaina: 5 eurai uz kg\nEkspresas (3 val.): papildomai 3 eurai`;
    const qs: [string, 'A'|'B'|'C'][] = [
      ['Kur galima valgyti ryte?', 'B'],
      ['Kur reikia priduoti drabužius skalbti?', 'C'],
      ['Kur vaikams siūloma mažesnė kaina?', 'A'],
      ['Kur patiekiami vegetariški patiekalai?', 'B'],
      ['Kur savaitgaliais reikia rezervuoti vietą?', 'A'],
      ['Kur skalbiniai gali būti paruošti per 3 valandas?', 'C'],
    ];
    for (let i = 0; i < qs.length; i++) {
      await createQ({ examId: eId, content: qs[i][0], type: 'MULTIPLE_CHOICE', skill: 'READING',
        order: i + 23, passage: p5pass, taskType: 'P5_NOTICES', variantSet: 'reading_B',
        opts: notices(qs[i][1]) });
    }
  }

  // ============================================================
  // READING C — Parduotuves ir prekybos centras (shopping)
  // ============================================================

  // P1 reading_C
  {
    const opts8 = [
      'Šis skyrius yra antrame aukšte.',
      'Parduotuvė dirba iki 21:00 valandos.',
      'Taip, turime šio dydžio.',
      'Grąžinti prekes galite per 14 dienų.',
      'Štai lojalumo kortelės prašymo forma.',
      'Nuolaida galioja tik šią savaitę.',
      'Kasa yra prie išėjimo, dešinėje.',
      'Liftas yra šalia informacijos centro.',
    ];
    const passage = 'Pirkėjų klausimai parduotuvėje';
    const qs: [string, number][] = [
      ['Kur galiu rasti avalynės skyrių?', 0],
      ['Iki kada šiandien dirba parduotuvė?', 1],
      ['Ar turite šių batų 40 dydžio?', 2],
      ['Ar galiu grąžinti šį daiktą?', 3],
      ['Kaip galiu gauti nuolaidų kortelę?', 4],
      ['Kur yra kasa?', 6],
    ];
    for (let i = 0; i < qs.length; i++) {
      await createQ({ examId: eId, content: qs[i][0], type: 'MULTIPLE_CHOICE', skill: 'READING',
        order: i + 1, passage, taskType: 'P1_MATCH', variantSet: 'reading_C',
        opts: labeled(opts8, qs[i][1]) });
    }
  }

  // P2 reading_C
  {
    const terms7 = ['Nuolaida','Grąžinimas','Garantija','Kvitas','Lojalumo kortelė','Akcija','Skyrius'];
    const qs: [string, number][] = [
      ['Atskira parduotuvės dalis, kurioje parduodamos tam tikros prekės.', 6],
      ['Pirkimo įrodymas, kurį gaunate mokėdami kasoje.', 3],
      ['Pardavėjo įsipareigojimas keisti arba taisyti sugedusius daiktus.', 2],
      ['Laikinas kainos sumažinimas tam tikroms prekėms.', 5],
      ['Kortelė, kuria galite rinkti taškus ir gauti nuolaidų.', 4],
    ];
    for (let i = 0; i < qs.length; i++) {
      await createQ({ examId: eId, content: qs[i][0], type: 'MULTIPLE_CHOICE', skill: 'READING',
        order: i + 7, taskType: 'P2_DEF_MATCH', variantSet: 'reading_C',
        opts: labeled(terms7, qs[i][1]) });
    }
  }

  // P3 reading_C
  {
    const p3pass = `D: Laba diena! [12]
K: Laba diena! [13]
D: Žinoma. [14]
K: Taip, štai jis.
D: Ačiū. Kodėl grąžinate?
K: [15]
D: Suprantu. Ar norėtumėte išsikeisti ar susigrąžinti pinigus?
K: Norėčiau susigrąžinti pinigus.
D: [16]
K: Labai ačiū!`;
    const phrases6 = [
      'Ar galiu jums padėti?',
      'Norėčiau grąžinti šiuos batus.',
      'Ar turite pirkimo kvitą?',
      'Batai buvo per maži ir nepatogūs.',
      'Pinigai bus grąžinti per 5 darbo dienas.',
      'Ar galiu pabandyti kitą dydį?',
    ];
    const answers = [0,1,2,3,4];
    for (let i = 0; i < 5; i++) {
      await createQ({ examId: eId, content: `Pasirinkite frazę vietai [${i+12}] dialoge`,
        type: 'MULTIPLE_CHOICE', skill: 'READING', order: i + 12, passage: p3pass,
        taskType: 'P3_DIALOGUE', variantSet: 'reading_C',
        opts: labeled(phrases6, answers[i]) });
    }
  }

  // P4 reading_C
  {
    const p4pass = `Dėmesio! Šį šeštadienį ir sekmadienį prekybos centre "Akropolis" vyks rugsėjo išpardavimas. Drabužiams ir avalynei taikoma 30–50% nuolaida. Elektronikos prekėms nuolaida siekia iki 20%. Akcija galioja tik parduotuvėje, internetu prekės parduodamos įprasta kaina. Pirkiniams virš 100 eurų – nemokamas pristatymas į namus. Parduotuvė šį savaitgalį dirbs ilgiau – nuo 9:00 iki 23:00. Daugiau informacijos rasite mūsų interneto puslapyje.`;
    const qs: [string, boolean][] = [
      ['Išpardavimas vyksta du dienas.', true],
      ['Nuolaida elektronikai yra tokia pat kaip drabužiams.', false],
      ['Internetu prekes galima pirkti su nuolaida.', false],
      ['Perkant daugiau nei 100 eurų, pristatymas į namus yra nemokamas.', true],
      ['Parduotuvė šį savaitgalį dirba ilgiau nei paprastai.', true],
      ['Informacijos apie akciją internete nerasite.', false],
    ];
    for (let i = 0; i < qs.length; i++) {
      await createQ({ examId: eId, content: qs[i][0], type: 'TRUE_FALSE', skill: 'READING',
        order: i + 17, passage: p4pass, taskType: 'P4_TRUE_FALSE', variantSet: 'reading_C',
        opts: tf(qs[i][1]) });
    }
  }

  // P5 reading_C
  {
    const p5pass = `§A§ DRABUZIU PARDUOTUVE "MADA"\nNauja kolekcija - jau parduotuveje!\nSia savaite: -20% visiems paltams\nDirbame: I-VI 10:00-20:00, VII 11:00-18:00\nLojalumo kortele - taupykite kas karta\n§B§ AVALYNES SALONAS "KOJA"\nDydziai nuo 35 iki 47\nGarantija visiems batams - 12 menesiu\nTaisykla parduotuveje\nDirbame: I-VII 10:00-21:00\n§C§ ELEKTRONIKOS PARDUOTUVE "BITE"\nKompiuteriai, telefonai, televizoriai\nNemokamas pristatymas pirkiniams virs 50 euru\nKonsultacija ir montavimas - nemokamai\nAkcija: senu prietaisu supirkimas`;
    const qs: [string, 'A'|'B'|'C'][] = [
      ['Kur galima rasti drabužių naujausią kolekciją?', 'A'],
      ['Kur siūloma garantija pirkiniams?', 'B'],
      ['Kur galima gauti nemokamą pristatymą?', 'C'],
      ['Kur galima taisyti apavą?', 'B'],
      ['Kur galima sutaupyti su nuolaidų kortele?', 'A'],
      ['Kur nemokamai sumontuos įsigytą prietaisą?', 'C'],
    ];
    for (let i = 0; i < qs.length; i++) {
      await createQ({ examId: eId, content: qs[i][0], type: 'MULTIPLE_CHOICE', skill: 'READING',
        order: i + 23, passage: p5pass, taskType: 'P5_NOTICES', variantSet: 'reading_C',
        opts: notices(qs[i][1]) });
    }
  }

  // ============================================================
  // LISTENING A — 4 sections × 5 questions = 20 (orders 101-120)
  // Passage prefix ||Speaker1 (role), Speaker2 (role)|| for NSA speaker display
  // ============================================================

  // L1_MCQ — Kavinė (café ordering)
  {
    const pass = `||Jonas (vyras, klientas), Eglė (moteris, padavėja)||
Jonas: Laba diena! Norėčiau kavos, prašom.
Eglė: Labai gerai. Kaip geriate – su pienu ar be?
Jonas: Su pienu, ir vienas cukrus.
Eglė: Žinoma. Ar norite ko nors valgyti?
Jonas: Taip, duokite pyragą su braškėmis.
Eglė: Puiku. Ar čia valgysite ar išsinešite?
Jonas: Čia vietoje. Ar turite wifi?
Eglė: Taip, slaptažodis yra ant jūsų stalo kortelėje.
Jonas: Ačiū labai. Kiek kainuoja kava?
Eglė: Kava su pienu kainuoja 2,80, o pyragas – 3,50.`;
    const qs: [string, string[], number][] = [
      ['Ką Jonas nori gerti?', ['Arbatą','Kavą','Sultis'], 1],
      ['Kaip Jonas geria kavą?', ['Be pieno','Be cukraus','Su pienu ir cukrumi'], 2],
      ['Ką Jonas užsisako valgyti?', ['Sumuštinį','Sriubą','Pyragą su braškėmis'], 2],
      ['Kur Jonas valgys?', ['Namuose','Čia vietoje','Išsinešimas'], 1],
      ['Kiek kainuoja kava su pienu?', ['2,50','2,80','3,20'], 1],
    ];
    for (let i = 0; i < qs.length; i++) {
      await createQ({ examId: eId, content: qs[i][0], type: 'MULTIPLE_CHOICE', skill: 'LISTENING',
        order: 101+i, passage: pass, variantSet: 'listening_A', taskType: 'L1_MCQ',
        opts: simple(qs[i][1], qs[i][2]) });
    }
  }

  // L2_MCQ — Gydytojo kabinetas (doctor visit)
  {
    const pass = `||Rasa (moteris, pacientė), Tomas (vyras, gydytojas)||
Rasa: Laba diena, daktare. Man labai skauda galvą jau tris dienas.
Tomas: Ar turite temperatūros?
Rasa: Taip, vakar buvo 38,2.
Tomas: Suprantu. Ar turite kitų simptomų – kosulys, sloga?
Rasa: Truputį sloga, bet kosulys silpnas.
Tomas: Gerai. Išrašysiu jums antibiotikų. Gerkite tris kartus per dieną po valgio.
Rasa: Ar galiu dirbti?
Tomas: Geriau porą dienų pabūkite namuose. Ir gerkite daug vandens.
Rasa: Ačiū. Kada reikėtų grįžti?
Tomas: Jei per penkias dienas nepagerės, ateikite vėl.`;
    const qs: [string, string[], number][] = [
      ['Kas skauda Rasai?', ['Pilvą','Galvą','Koją'], 1],
      ['Kiek dienų jai skauda?', ['Vieną dieną','Dvi dienas','Tris dienas'], 2],
      ['Kokia buvo Rasos temperatūra vakar?', ['37,5','38,2','39,0'], 1],
      ['Kada reikia gerti antibiotikus?', ['Vieną kartą per dieną','Du kartus per dieną','Tris kartus per dieną po valgio'], 2],
      ['Ką gydytojas rekomenduoja Rasai?', ['Eiti į darbą','Pabūti namuose porą dienų','Vykti į ligoninę'], 1],
    ];
    for (let i = 0; i < qs.length; i++) {
      await createQ({ examId: eId, content: qs[i][0], type: 'MULTIPLE_CHOICE', skill: 'LISTENING',
        order: 106+i, passage: pass, variantSet: 'listening_A', taskType: 'L2_MCQ',
        opts: simple(qs[i][1], qs[i][2]) });
    }
  }

  // L3_MCQ — Autobuso stotelė (bus directions)
  {
    const pass = `||Mantas (vyras, studentas), Laura (moteris, keleivė)||
Mantas: Atsiprašau, ar žinote, kuriuo autobusu važiuoti į oro uostą?
Laura: Taip, žinoma. Reikia sėsti į 1 autobusą.
Mantas: O kur jo stotelė?
Laura: Čia pat, per gatvę. Maždaug 50 metrų nuo čia.
Mantas: Kiek laiko važiuojama?
Laura: Apie trisdešimt minučių be kamščių.
Mantas: O ar dažnai jis važiuoja?
Laura: Kas penkiolika minučių. Kitas bus po dešimties minučių.
Mantas: Labai ačiū. Beje, ar reikia pirkti bilietą iš anksto?
Laura: Ne, galite mokėti kortele tiesiog autobuse.`;
    const qs: [string, string[], number][] = [
      ['Kur nori vykti Mantas?', ['Į centrą','Į ligoninę','Į oro uostą'], 2],
      ['Kuriuo autobusu reikia važiuoti?', ['3 autobusu','1 autobusu','5 autobusu'], 1],
      ['Kiek laiko važiuojama iki tikslo?', ['15 minučių','30 minučių','45 minutes'], 1],
      ['Kas kiek minučių važiuoja autobusas?', ['Kas 5 min','Kas 10 min','Kas 15 min'], 2],
      ['Kaip galima mokėti už bilietą?', ['Tik grynaisiais','Kortele autobuse','Pirkti internetu'], 1],
    ];
    for (let i = 0; i < qs.length; i++) {
      await createQ({ examId: eId, content: qs[i][0], type: 'MULTIPLE_CHOICE', skill: 'LISTENING',
        order: 111+i, passage: pass, variantSet: 'listening_A', taskType: 'L3_MCQ',
        opts: simple(qs[i][1], qs[i][2]) });
    }
  }

  // L4_FILL — Radijo skelbimas (fill in words you heard)
  {
    const pass = `||Radijo diktoriaus pranešimas||
Laba diena, klausotės Lietuvos radijo. Vilniaus centre šį šeštadienį vyks [1] šventė. Renginys prasidės [2] valandą. Katedros aikštėje grieš lietuvių [3] grupės. Vakare laukiamos [4]. Renginio metu centrinės gatvės bus uždarytos [5].`;
    const qs: [string, string][] = [
      ['Kokia šventė vyks šeštadienį? (Įrašykite vieną žodį)', 'miesto'],
      ['Kelintą valandą prasidės renginys? (Įrašykite skaičių)', 'dvyliktą'],
      ['Kokios grupės grieš Katedros aikštėje? (Įrašykite vieną žodį)', 'muzikos'],
      ['Ko laukiama vakare? (Įrašykite vieną žodį)', 'fejerverkų'],
      ['Kodėl bus uždarytos gatvės? (Įrašykite vieną žodį)', 'eismui'],
    ];
    for (let i = 0; i < qs.length; i++) {
      await createQ({ examId: eId, content: qs[i][0], type: 'FILL_BLANK', skill: 'LISTENING',
        order: 116+i, passage: pass, variantSet: 'listening_A', taskType: 'L4_FILL',
        opts: [{ content: qs[i][1], isCorrect: true, order: 0 }] });
    }
  }

  // ============================================================
  // LISTENING B — 4 sections × 5 questions = 20 (orders 101-120)
  // ============================================================

  // L1_MCQ — Vaistinė (pharmacy)
  {
    const pass = `||Kristina (moteris, pacientė), Arūnas (vyras, vaistininkas)||
Kristina: Laba diena. Man labai skauda gerklę ir nedaug kosulys.
Arūnas: Ar turite temperatūros?
Kristina: Temperatūra yra 37,8.
Arūnas: Suprantu. Galiu rekomenduoti paracetamolį – jis sumažins temperatūrą. Gerklei pasiūlyčiau losengus.
Kristina: O ar reikia recepto?
Arūnas: Ne, abu vaistai parduodami be recepto. Paracetamolis kainuoja 3 eurus, o losengai – 5 eurus.
Kristina: Gerai, paimsiu abu. Kaip dažnai gerti paracetamolį?
Arūnas: Kas šešias valandas, ne daugiau kaip keturis kartus per dieną.
Kristina: Ačiū. Ar dar galite ką nors patarti?
Arūnas: Gerkite daug šilto vandens ir arbatos su citrina.`;
    const qs: [string, string[], number][] = [
      ['Kas skauda Kristinai?', ['Galvą','Pilvą','Gerklę'], 2],
      ['Kokia Kristinos temperatūra?', ['36,8','37,8','38,5'], 1],
      ['Ką rekomenduoja vaistininkas nuo gerklės?', ['Purškiklį','Losengus','Sirupą'], 1],
      ['Kiek kainuoja paracetamolis?', ['2 eurai','3 eurai','5 eurai'], 1],
      ['Kaip dažnai gerti paracetamolį?', ['Kas 4 val.','Kas 6 val.','Kas 8 val.'], 1],
    ];
    for (let i = 0; i < qs.length; i++) {
      await createQ({ examId: eId, content: qs[i][0], type: 'MULTIPLE_CHOICE', skill: 'LISTENING',
        order: 101+i, passage: pass, variantSet: 'listening_B', taskType: 'L1_MCQ',
        opts: simple(qs[i][1], qs[i][2]) });
    }
  }

  // L2_MCQ — Traukinių stotis (train station)
  {
    const pass = `||Marius (vyras, keleivis), Virginija (moteris, kasirė)||
Marius: Laba diena. Norėčiau bilieto į Kauną.
Virginija: Labai gerai. Kuriai dienai ir valandai?
Marius: Šiandien, kuo greičiau.
Virginija: Kitas traukinys į Kauną išvažiuos po dvidešimties minučių, 14:35.
Marius: Puiku. Kiek kainuoja bilietas?
Virginija: Vienas bilietas į Kauną kainuoja 8 eurus. Ar jums reikia sugrįžimo bilieto?
Marius: Taip, sugrįšiu rytoj vakare.
Virginija: Tada grįžimas kainuos dar 8 eurus. Iš viso – 16 eurų.
Marius: Gerai. Kuris perons?
Virginija: Traukinys išvažiuoja iš trečio perono.`;
    const qs: [string, string[], number][] = [
      ['Kur važiuoja Marius?', ['Į Vilnių','Į Kauną','Į Klaipėdą'], 1],
      ['Kada išvažiuoja kitas traukinys?', ['14:15','14:35','15:00'], 1],
      ['Kiek kainuoja vienas bilietas?', ['6 eurai','8 eurai','10 eurų'], 1],
      ['Kiek kainuoja abu bilietai?', ['12 eurų','14 eurų','16 eurų'], 2],
      ['Iš kurio perono išvažiuoja traukinys?', ['Pirmo','Antro','Trečio'], 2],
    ];
    for (let i = 0; i < qs.length; i++) {
      await createQ({ examId: eId, content: qs[i][0], type: 'MULTIPLE_CHOICE', skill: 'LISTENING',
        order: 106+i, passage: pass, variantSet: 'listening_B', taskType: 'L2_MCQ',
        opts: simple(qs[i][1], qs[i][2]) });
    }
  }

  // L3_MCQ — Viešbutis (hotel check-in)
  {
    const pass = `||Pita (moteris, svečia), Daina (moteris, administratorė)||
Pita: Laba diena. Turiu rezervaciją. Pavardė – Tanaka.
Daina: Laba diena! Taip, randu jūsų rezervaciją. Vienvietis kambarys trims naktims.
Pita: Taip, teisingai. Ar galiu anksti įsiregistruoti? Atvykau anksčiau.
Daina: Žinoma. Jūsų kambarys jau paruoštas. Tai 305 kambarys.
Pita: Ačiū. Ar yra liftas?
Daina: Taip, liftas yra dešinėje.
Pita: O kada pusryčiai?
Daina: Pusryčiai nuo 7 iki 10 ryto pirmo aukšto restorane.
Pita: Puiku. Ar turite bagažo saugojimo?
Daina: Taip, galite palikti bagažą čia priimamajame.`;
    const qs: [string, string[], number][] = [
      ['Kiek naktų Pita apsistos viešbutyje?', ['Vieną naktį','Dvi naktis','Tris naktis'], 2],
      ['Koks Pitos kambario numeris?', ['205','305','405'], 1],
      ['Kur yra liftas?', ['Kairėje','Dešinėje','Tiesiai'], 1],
      ['Iki kelios valandos trunka pusryčiai?', ['9:00','10:00','11:00'], 1],
      ['Kur galima palikti bagažą?', ['Kambaryje','Lifto aikštelėje','Priimamajame'], 2],
    ];
    for (let i = 0; i < qs.length; i++) {
      await createQ({ examId: eId, content: qs[i][0], type: 'MULTIPLE_CHOICE', skill: 'LISTENING',
        order: 111+i, passage: pass, variantSet: 'listening_B', taskType: 'L3_MCQ',
        opts: simple(qs[i][1], qs[i][2]) });
    }
  }

  // L4_FILL B — Sporto centro skelbimas
  {
    const pass = `||Sporto centro skelbimas||
Dėmesio! Vilniaus sporto centras informuoja: nuo [1] mūsų centras dirbs nauju darbo laiku. Rytiniai užsiėmimai prasidės [2] valandą. Vakare centras dirbs iki [3] valandos. Baseinui reikia pirkti atskirą [4]. Vaikų sekcija veiks tik [5] ir penktadieniais.`;
    const qs: [string, string][] = [
      ['Nuo kada centras dirbs nauju laiku? (Įrašykite vieną žodį)', 'pirmadienio'],
      ['Kelintą valandą prasidės rytiniai užsiėmimai? (Įrašykite)', 'šeštą'],
      ['Iki kelios valandos centras dirbs vakare? (Įrašykite)', 'dešimtos'],
      ['Ko reikia baseinui? (Įrašykite vieną žodį)', 'bilietą'],
      ['Kuriomis dienomis veikia vaikų sekcija? (Įrašykite)', 'antradieniais'],
    ];
    for (let i = 0; i < qs.length; i++) {
      await createQ({ examId: eId, content: qs[i][0], type: 'FILL_BLANK', skill: 'LISTENING',
        order: 116+i, passage: pass, variantSet: 'listening_B', taskType: 'L4_FILL',
        opts: [{ content: qs[i][1], isCorrect: true, order: 0 }] });
    }
  }

  // ============================================================
  // SPEAKING A — 8 tasks (orders 401-408)
  // ============================================================
  {
    const spkA: [string, string | null][] = [
      ['Laba diena. Pradedame kalbėjimo užduotį.\n\nPasakykite savo vardą, pavardę ir šalį arba miestą, iš kur atvykote.', null],
      ['Pasakykite, ką mėgstate valgyti pietums ir kodėl.', null],
      ['Pažiūrėkite į paveikslėlį ekrane.\n\nApibūdinkite, ką matote paveikslėlyje. Pasakykite, kas yra pavaizduota, kur vyksta veiksmas ir ką veikia žmonės.', 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600'],
      ['Ką veikėte šiandien ryte? Papasakokite apie savo rytinę rutiną.', null],
      ['Papasakokite apie savo šeimą. Kiek žmonių jūsų šeimoje? Kokie jie?', null],
      ['Apibūdinkite savo kasdieninę rutiną. Ką darote ryte, dieną ir vakare?', null],
      ['Jūsų draugas atvyksta į Lietuvą pirmą kartą.\n\nPasakykite, ką rekomenduotumėte pamatyti Vilniuje ir kodėl.', null],
      ['Pasakykite, kokius hobius turite. Kodėl jums tai patinka? Kaip dažnai užsiimate šia veikla?', null],
    ];
    for (let i = 0; i < spkA.length; i++) {
      const passageArg = spkA[i][1] ?? undefined
      await createQ({ examId: eId, content: spkA[i][0], type: 'TEXT_INPUT', skill: 'SPEAKING',
        order: 401+i, variantSet: 'speaking_A', taskType: 'S_SPEAK',
        passage: passageArg,
        opts: [] });
    }
  }

  // ============================================================
  // SPEAKING B — 8 tasks (orders 401-408)
  // ============================================================
  {
    const spkB: [string, string | null][] = [
      ['Laba diena. Pradedame kalbėjimo užduotį.\n\nPasakykite savo vardą, pavardę, amžių ir profesiją.', null],
      ['Papasakokite apie savo miestelį ar miestą, kuriame gyvenate. Kas jame gražu ar įdomu?', null],
      ['Pažiūrėkite į paveikslėlį ekrane.\n\nApibūdinkite, ką matote paveikslėlyje. Kur yra šie žmonės ir ką jie daro?', 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=600'],
      ['Papasakokite apie praėjusį savaitgalį. Ką veikėte? Su kuo buvote?', null],
      ['Ką veiksite artimiausiomis atostogomis? Kur planuojate vykti?', null],
      ['Apibūdinkite savo draugą ar pažįstamą. Kaip jis atrodo? Koks jo charakteris?', null],
      ['Pasakykite, kokia jūsų mėgstamiausia šventė. Kaip ją švenčiate ir su kuo?', null],
      ['Ar jums patinka sportas? Kokį sportą mėgstate? Kaip dažnai sportaujate?', null],
    ];
    for (let i = 0; i < spkB.length; i++) {
      const passageArg = spkB[i][1] ?? undefined
      await createQ({ examId: eId, content: spkB[i][0], type: 'TEXT_INPUT', skill: 'SPEAKING',
        order: 401+i, variantSet: 'speaking_B', taskType: 'S_SPEAK',
        passage: passageArg,
        opts: [] });
    }
  }

  // ============================================================
  // WRITING POOL — orders 201-220 (NSA format: W1+W2+W3+W4)
  // ============================================================
  {
    // W1_FILL: Passage with 6 type-in gaps (Susitikimas kavinėje)
    const w1Passage = 'Labas, Tomai, ką veiki [1] vakarą? Gal nori [2] kavos? Susitinkame [3] centre. Ten [4] labai gera kavinė. Labas, Lina, mielai [5] sutinku! Kelintą valandą [6] susitinkame?';
    const w1: [string, string, string][] = [
      ['1 užduotis (W1). Įrašykite trūkstamą žodį į tarpą [1].', 'šį',
        '"Šį" is the accusative masculine of "šis" (this). Time expressions in Lithuanian use the accusative: šį vakarą (this evening), šį rytą (this morning), šią savaitę (this week). "Šį" agrees with "vakarą" (masculine accusative).'],
      ['1 užduotis (W1). Įrašykite trūkstamą žodį į tarpą [2].', 'išgerti',
        '"Išgerti" is the infinitive of "išgerti" (to have a drink). After "nori" (wants), Lithuanian uses an infinitive: nori išgerti = wants to drink. The genitive "kavos" that follows means "some coffee" — after the infinitive of a drink/eat verb, genitive expresses a partial amount.'],
      ['1 užduotis (W1). Įrašykite trūkstamą žodį į tarpą [3].', 'miesto',
        '"Miesto" is the genitive of "miestas" (city/town). The phrase "miesto centre" = in the city centre. In Lithuanian, "centre" (centre) is modified by a genitive noun: miesto (of the city). This is a very common fixed phrase.'],
      ['1 užduotis (W1). Įrašykite trūkstamą žodį į tarpą [4].', 'yra',
        '"Yra" is the 3rd person singular/plural present of "būti" (to be). "Ten yra labai gera kavinė" = there is a very good café there. "Yra" is the only form used for 3rd person — the same for jis yra, ji yra, jie yra.'],
      ['1 užduotis (W1). Įrašykite trūkstamą žodį į tarpą [5].', 'mielai',
        '"Mielai" is an adverb meaning "gladly / with pleasure". "Mielai sutinku!" = I gladly agree! This is a common polite expression when accepting an invitation in Lithuanian. It comes from the adjective "mielas" (dear/pleasant).'],
      ['1 užduotis (W1). Įrašykite trūkstamą žodį į tarpą [6].', 'mes',
        '"Mes" (we) is the 1st person plural subject pronoun. "Kelintą valandą mes susitinkame?" = At what time are we meeting? The subject "mes" is often omitted in everyday speech since the verb ending (-ame) already signals 1st plural, but it can be added for clarity or emphasis.'],
    ];
    for (let i = 0; i < w1.length; i++) {
      await createQ({ examId: eId, content: w1[i][0], type: 'FILL_BLANK', skill: 'WRITING',
        order: 201 + i, variantSet: 'writing_pool', taskType: 'W1_FILL', passage: w1Passage,
        explanation: w1[i][2],
        opts: [{ content: w1[i][1], isCorrect: true, order: 0 }] });
    }

    // W2_SELECT: Passage with 6 dropdown gaps (Nauja kavinė)
    const w2Passage = 'Šį pirmadienį Vilniuje [1] nauja kavinė „Kava". Čia lankytojai galės ne tik atsigerti [2], bet ir paragauti naminių pyragų. Ši kavinė yra labai [3] ir šviesi. [4] kavinėje dirba labai mandagūs padavėjai. Kiekvieną rytą čia galite nusipirkti [5] bandelių. Tikimės, kad jums [6] pas mus lankytis.';
    const w2: [string, string[], number, string][] = [
      ['2 užduotis (W2). Pasirinkite tinkamą žodį tarpui [1].', ['atidaroma','atidaryta','atveria','atidarė'], 0,
        '"Atidaroma" is the passive present tense (esamojo laiko pasyvas). The sentence means "a new café is being opened". The passive is needed here because the café is being opened by someone (an implied agent). "Atidaryta" is past passive; "atidarė" is active past ("opened"); "atveria" means "opens" (active, different verb).'],
      ['2 užduotis (W2). Pasirinkite tinkamą žodį tarpui [2].', ['kavos','alaus','pieno','arbatos'], 0,
        '"Kavos" (genitive of kava = coffee) is the only contextually correct answer — the café is called "Kava" (Coffee). Also grammatically, after "atsigerti" (to have a drink of), the genitive case is required: atsigerti kavos (to have some coffee). All options are grammatically correct genitive forms, but only kavos fits the context.'],
      ['2 užduotis (W2). Pasirinkite tinkamą žodį tarpui [3].', ['jauki','didelė','brangi','sena'], 0,
        '"Jauki" (cosy, warm) fits because the sentence describes the café positively alongside "šviesi" (bright/light). The adjective must be feminine to agree with "kavinė" (feminine noun). "Jauki" is feminine nominative of "jaukus". The pairing "jauki ir šviesi" creates a welcoming image.'],
      ['2 užduotis (W2). Pasirinkite tinkamą žodį tarpui [4].', ['Šioje','Mūsų','Ta','Kiekviena'], 0,
        '"Šioje" is the locative of "ši" (this, feminine demonstrative), agreeing with "kavinėje" (locative). "Šioje kavinėje" = in this café. The locative -oje ending on the noun requires a matching demonstrative also in locative. "Šioje" is the correct locative feminine form of "šis/ši".'],
      ['2 užduotis (W2). Pasirinkite tinkamą žodį tarpui [5].', ['šviežių','senų','brangių','mažų'], 0,
        '"Šviežių" (fresh, genitive plural) is the correct choice contextually — fresh bread rolls are a selling point. Grammatically, "nusipirkti" (to buy) with an indefinite quantity uses genitive: nusipirkti šviežių bandelių = to buy some fresh rolls. The genitive plural of "šviežias" is "šviežių".'],
      ['2 užduotis (W2). Pasirinkite tinkamą žodį tarpui [6].', ['patiks','nepatinka','patiko','nepatiks'], 0,
        '"Patiks" is the future tense of "patikti" (to please / to like). "Tikimės, kad jums patiks" = We hope you will like (coming to us). The future tense is required because this is a hope about something that has not yet happened. "Patiko" is past (already liked); "nepatinka" is negative present.'],
    ];
    for (let i = 0; i < w2.length; i++) {
      const [content, opts, ci, explanation] = w2[i];
      await createQ({ examId: eId, content, type: 'MULTIPLE_CHOICE', skill: 'WRITING',
        order: 207 + i, variantSet: 'writing_pool', taskType: 'W2_SELECT', passage: w2Passage,
        explanation,
        opts: simple(opts, ci) });
    }

    // W3_FORM: Short-answer form questions (Sporto centro registracija)
    const w3Prompt = 'Sporto centro registracijos forma. Atsakykite į klausimus trumpais sakiniais.';
    const w3Qs = [
      'Koks jūsų vardas ir pavardė?',
      'Koks jūsų amžius?',
      'Ar anksčiau sportavote?',
      'Kokiu laiku norite lankytis salėje?',
      'Koks jūsų telefono numeris?',
      'Koks jūsų elektroninis paštas?',
      'Ar jums reikalingas treneris?',
    ];
    for (let i = 0; i < w3Qs.length; i++) {
      await createQ({ examId: eId, content: w3Qs[i], type: 'TEXT_INPUT', skill: 'WRITING',
        order: 213 + i, variantSet: 'writing_pool', taskType: 'W3_FORM', passage: w3Prompt,
        opts: [] });
    }

    // W4_FREE: Short free-text writing (Skelbimas 20–30 žodžių)
    const w4Content = '4 užduotis: Skelbimas\n\nJūs radote raudoną krepšį (rankinę). Parašykite skelbimą (20–30 žodžių).\n\nParašykite:\n• kur ir kada radote\n• kaip atrodo krepšys\n• kaip savininkas gali jums paskambinti';
    await createQ({ examId: eId, content: w4Content, type: 'TEXT_INPUT', skill: 'WRITING',
      order: 220, variantSet: 'writing_pool', taskType: 'W4_FREE',
      opts: [] });
  }

  // ============================================================
  // GRAMMAR POOL — orders 301-375 (75 questions)
  // ============================================================
  {
    const g: [string, string[], number, string][] = [
      // Veiksmažodžiai - esamasis laikas (present tense)
      ['Aš ___ lietuviškai kalbėti.',['mokate','moku','mokame','mokosi'],1,
        'The 1st person singular (aš) of mokėti ends in -u: moku (I can/know how to). "Mokate" is 2nd plural (jūs), "mokame" is 1st plural (mes). Rule: aš → -u, tu → -i, jis/ji → -a.'],
      ['Tu ___ labai gerai.',['dainoji','dainoja','dainu','dainate'],0,
        'The 2nd person singular (tu) ends in -i for this verb group: tu dainoji (you sing). Compare: aš dainu (I), jis/ji dainoja (he/she), mes dainuojame (we).'],
      ['Jis ___ banke.',['dirbu','dirbi','dirba','dirbame'],2,
        'The 3rd person singular (jis = he) ends in -a: dirba (he works). Full pattern: aš dirbu → tu dirbi → jis/ji dirba → mes dirbame → jūs dirbate → jie/jos dirba.'],
      ['Ji ___ Kaune.',['gyvenu','gyveni','gyvena','gyvenam'],2,
        'The 3rd person singular (ji = she) of gyventi: gyvena. This is Group 1 conjugation (-a ending): gyvenu/gyveni/gyvena. "Gyvenu" is 1st person (aš), "gyveni" is 2nd person (tu).'],
      ['Mes ___ kavos.',['geriu','geria','geriam','geriame'],3,
        '1st person plural (mes) ends in -ame: geriame (we drink). The -ame ending always marks 1st plural. "Geriu" is aš, "geria" is jis/ji/jie, "geriam" is an informal short form.'],
      ['Jūs ___ lietuvių kalbos.',['mokausi','mokai','mokotės','mokosi'],2,
        '"Mokytis" is reflexive (ends in -si/-s). The 2nd person plural (jūs) of reflexive verbs ends in -tės: mokotės. Non-reflexive "mokytis" vs "mokyti": the -si marks reflexive action (learning for yourself).'],
      ['Jie ___ į parduotuvę.',['einu','eina','einam','einame'],1,
        '3rd person plural (jie = they) of eiti: eina. Both singular and plural 3rd person share the same form: jis eina AND jie eina. "Einu" is aš, "einam/einame" is mes.'],
      ['Aš ___ sriubą.',['valgai','valgo','valgau','valgome'],2,
        '1st person singular (aš) of valgyti (Group 2, -yti verbs): valgau. Group 2 pattern: aš valgau → tu valgai → jis/ji valgo. Note: 1sg ends in -au (not -u like Group 1).'],
      ['Tu ___ knygą.',['skaitai','skaito','skaitau','skaitome'],0,
        '2nd person singular (tu) of skaityti: skaitai. Group 2 pattern: aš skaitau → tu skaitai → jis/ji skaito. The -ai ending marks 2nd person singular in this group.'],
      ['Mes ___ laikraštį rytais.',['skaitome','skaito','skaitau','skaitote'],0,
        '1st person plural (mes) of skaityti: skaitome. Group 2 plural: mes skaitome → jūs skaitote → jie/jos skaito. "Skaitau" is aš, "skaito" is 3rd person.'],
      // Veiksmažodžiai - būtasis laikas (past tense)
      ['Vakar aš ___ su draugu.',['kalbėjo','kalbėjai','kalbėjau','kalbėjome'],2,
        '"Vakar" (yesterday) signals past tense. 1st person singular past of kalbėti: kalbėjau. Past pattern: kalbėjau → kalbėjai → kalbėjo → kalbėjome. The -jau ending marks 1sg past for -ėti verbs.'],
      ['Jis praeitą savaitę ___ daug.',['dirbau','dirbai','dirbo','dirbome'],2,
        '"Praeitą savaitę" (last week) = past tense. 3rd person singular past (jis): dirbo. Group 1 past: dirbau → dirbai → dirbo → dirbome. The -o ending marks 3rd person past.'],
      ['Mes vakar ___ į kiną.',['ėjau','ėjome','ėjo','ėjote'],1,
        'Past tense 1st plural (mes): ėjome. Eiti (to go) has an irregular past tense — the stem changes completely: present eina → past ėjo. Pattern: ėjau → ėjai → ėjo → ėjome → ėjote → ėjo.'],
      ['Tu vakar ___ pietus namuose?',['valgiau','valgei','valgė','valgėme'],1,
        '2nd person singular past (tu): valgei. Group 2 past: valgiau → valgei → valgė. The -ei ending marks 2nd person past. "Valgiau" = aš, "valgė" = jis/ji.'],
      ['Jie praeitą mėnesį ___ po Europą.',['keliavo','keliavau','keliavome','keliavote'],0,
        '3rd person past of keliauti (to travel): keliavo. The -auti/-uoti verbs have a special past tense pattern with -av-: keliavau → keliavai → keliavo. Both 3rd sg and pl use "keliavo".'],
      ['Ji vakar ___ knygą.',['skaitė','skaičiau','skaitei','skaitėme'],0,
        '3rd person singular past (ji): skaitė. Group 2 past ends in -ė for 3rd person: skaičiau → skaitei → skaitė. Note: 1sg is "skaičiau" (t softens to č before -iau).'],
      ['Aš vakar ___ naujus batus.',['pirko','pirkau','pirkai','pirkome'],1,
        '1st person singular past (aš) of pirkti: pirkau. Group 1 past: pirkau → pirkai → pirko → pirkome. "Pirko" is 3rd person, not 1st. The -au ending marks 1sg past.'],
      ['Jūs praeitą savaitę ___ lietuvių kalbos?',['mokiausi','mokėtės','mokėsi','mokėmės'],1,
        '2nd person plural past of reflexive mokytis: mokėtės. The -tės ending marks reflexive 2nd plural past. Compare present: mokotės → past: mokėtės.'],
      ['Mes pernai ___ Kaune.',['gyvenome','gyveno','gyvenau','gyvenote'],0,
        '1st person plural past (mes) of gyventi: gyvenome. Group 1 past plural: gyvenome → gyvenote → gyveno. "Gyveno" is 3rd person, "gyvenau" is 1sg.'],
      ['Vakar jis ___ vėlai.',['atėjau','atėjai','atėjo','atėjome'],2,
        '3rd person past (jis) of ateiti (to arrive/come): atėjo. Compound verbs with "at-" follow the same irregular pattern as eiti: atėjau → atėjai → atėjo. "Vakar" signals past tense.'],
      // Veiksmažodžiai - būsimasis laikas (future tense)
      ['Rytoj aš ___ į Vilnių.',['važiuosiu','važiuos','važiuosite','važiuosime'],0,
        '"Rytoj" (tomorrow) signals future tense. 1st person singular future: važiuosiu. Lithuanian future uses -s- infix: važiuosiu → važiuosi → važiuos → važiuosime → važiuosite → važiuos.'],
      ['Kitą savaitę jis ___ naujame biure.',['dirbs','dirbsiu','dirbsite','dirbsime'],0,
        '3rd person future (jis): dirbs. Future pattern: dirbsiu → dirbsi → dirbs → dirbsime → dirbsite → dirbs. Both 3sg and 3pl share "dirbs". "Kitą savaitę" (next week) = future.'],
      ['Mes rytoj ___ į turgų.',['eisiu','eisime','eis','eisite'],1,
        '1st person plural future (mes): eisime. Eiti future: eisiu → eisi → eis → eisime → eisite → eis. Both 3rd person forms use "eis".'],
      ['Tu rytoj ___ pusryčius namuose?',['valgysiu','valgysi','valgys','valgysite'],1,
        '2nd person singular future (tu): valgysi. Future: valgysiu → valgysi → valgys. The -si ending marks 2nd person singular future. "Rytoj" = future tense.'],
      ['Jie rytoj ___ iš Lenkijos.',['atvyks','atvyksiu','atvyksime','atvyksite'],0,
        '3rd person future (jie/jos): atvyks. Both singular and plural 3rd person share the same future form: jis atvyks AND jie atvyks. This is a key feature of Lithuanian future tense.'],
      // Kilmininkas (genitive case)
      ['Aš neturiu ___ (knyga).',['knygą','knyga','knygos','knygai'],2,
        'Negation triggers the genitive case (kilmininkas). "Neturiu" (I don\'t have) requires genitive: knyga → knygos. Rule: affirmative uses accusative "knygą", but negation shifts it to genitive "knygos". Ask: ko? (of what?).'],
      ['Jis nupirko daug ___ (obuolys).',['obuolius','obuolių','obuoliai','obuoliu'],1,
        'Quantity words like "daug" (many/much), "mažai" (few), "kiek" (how many) always require genitive plural. Obuolys (apple) → genitive plural: obuolių. This is a fixed grammar rule: daug + genitive plural.'],
      ['Man trūksta ___ (laikas).',['laikas','laiko','laikui','laiku'],1,
        'The verb "trūksta" (there is a lack of / is missing) always governs genitive: laikas → laiko (genitive singular). Ask "ko trūksta?" (what is lacking?). Masculine -as nouns: genitive singular = -o.'],
      ['Jie neturi ___ (pinigai).',['pinigus','pinigų','pinigai','pinigams'],1,
        'Negation with "neturi" (they don\'t have) requires genitive: pinigai → pinigų (genitive plural). Masculine plural -ai nouns: genitive plural = -ų. Compare: accusative plural would be "pinigus".'],
      ['Ji negeria ___ (kava).',['kavą','kavai','kavos','kava'],2,
        'Negation rule: "negeria" (doesn\'t drink) changes the object from accusative to genitive. Kava (nominative) → kavos (genitive). Feminine -a nouns: genitive = -os. Affirmative: geria kavą (accusative).'],
      // Galininkas (accusative case)
      ['Aš skaitau ___ (knyga).',['knyga','knygą','knygos','knygoje'],1,
        'The direct object of a transitive verb takes the accusative (galininkas). "Skaitau" (I read) is transitive: knyga → knygą. Rule: feminine nouns in -a form accusative by adding -ą. Ask: ką? (what?).'],
      ['Jis perka ___ (automobilis).',['automobilio','automobiliui','automobilį','automobilyje'],2,
        '"Perka" (buys) is transitive — its object takes accusative. Automobilis (masculine -is noun) → accusative: automobilį (-is → -į). Ask: ką? The -į ending marks masculine accusative for -is nouns.'],
      ['Mes matome ___ (medis).',['medžio','medį','medžiui','medyje'],1,
        '"Matome" (we see) takes a direct object in accusative. Medis (tree, masculine -is noun) → accusative: medį. Note: the stem changes (medis → medį, but medžio in genitive). Ask: ką matome?'],
      ['Ji valgo ___ (obuolys).',['obuolio','obuolį','obuoliui','obuoliai'],1,
        '"Valgo" (eats) takes accusative. Obuolys (apple, masculine -ys noun) → accusative: obuolį (-ys → -į). The -į ending is the standard accusative for masculine nouns ending in -is/-ys.'],
      ['Aš myliu ___ (mama).',['mamai','mamą','mamos','mamoje'],1,
        '"Myliu" (I love) is transitive — takes accusative. Mama → mamą (-a → -ą). All feminine nouns ending in -a form accusative by replacing -a with -ą. Ask: ką myliu? → mamą.'],
      // Naudininkas (dative case)
      ['Aš pasakiau ___ (draugas).',['draugą','draugui','draugo','drauge'],1,
        'The dative case (naudininkas) marks the indirect object — to/for whom. "Pasakiau" (I told) — told to whom? Draugas → draugui (-as → -ui). Ask: kam? (to whom?). Dative of -as nouns: -ui.'],
      ['Ji duoda ___ (vaikas) saldainį.',['vaiko','vaikui','vaiką','vaikams'],1,
        '"Duoda" (gives) requires dative for the recipient: vaikas → vaikui (-as → -ui). The saldainį (sweet) is the direct object (accusative), while vaikui is the indirect object (dative). Ask: kam duoda?'],
      ['Mes rašome ___ (mama) laišką.',['mamą','mamoje','mamai','mamos'],2,
        'Dative of feminine mama: mamai (-a → -ai). "Rašome laišką" — we write a letter to whom? mamai (to mum). Feminine -a nouns form dative with -ai. Ask: kam rašome?'],
      ['Jis sako ___ (studentai) apie egzaminą.',['studentus','studentų','studentams','studentai'],2,
        'Dative plural: studentai → studentams (-ai → -ams). "Sako" (says/tells) — tells to whom? To the students (plural dative). Rule: masculine plural dative always ends in -ams.'],
      ['Ji padovanojo ___ (sesuo) knygą.',['seseriai','sesers','seserį','seseryje'],0,
        'Sesuo (sister) is an irregular noun with stem changes: nominative sesuo, but dative seseriai. It belongs to the -uo declension: sesuo → sesers (gen) → seseriai (dat) → seserį (acc). Must be memorised.'],
      // Vietininkas (locative case)
      ['Aš gyvenu ___ (miestas).',['miestą','mieste','miesto','miestui'],1,
        'The locative case (vietininkas) expresses location — where something is or happens. "Gyvenu" (I live) kur? Miestas → mieste (-as → -e). Masculine -as nouns: locative = -e. Ask: kur?'],
      ['Knyga yra ___ (stalas).',['stalą','stalo','stale','stalui'],2,
        '"Yra" (is) with location uses locative. Stalas → stale (-as → -e). "Knyga yra stale" = the book is in/on the table. Compare: ant stalo (on top of the table, genitive) vs stale (inside the table/desk).'],
      ['Jis dirba ___ (mokykla).',['mokyklą','mokyklos','mokykloje','mokyklai'],2,
        'Location of work uses locative: mokykla → mokykloje (-a → -oje). Feminine -a nouns: locative = -oje. "Dirba kur?" → mokykloje. Compare: accusative mokyklą (direction: "into school") vs locative mokykloje (location: "at school").'],
      ['Mes esame ___ (parduotuvė).',['parduotuvėje','parduotuvę','parduotuvės','parduotuvei'],0,
        'Locative of parduotuvė (shop): parduotuvėje (-ė → -ėje). Feminine -ė nouns: locative = -ėje. "Esame kur?" → parduotuvėje. The -ėje ending is the locative marker for this noun type.'],
      ['Ji mokosi ___ (universitetas).',['universiteto','universitete','universitetą','universitetui'],1,
        'Locative of universitetas: universitete (-as → -e). "Mokosi kur?" → universitete. Masculine -as nouns always form locative with -e. Compare: genitive universiteto (of the university) vs locative universitete (at the university).'],
      // Būdvardžių derinimas (adjective agreement)
      ['Jis yra ___ mokinys.',['gera','gerą','gero','geras'],3,
        'Adjectives must agree with the noun in gender, case, and number. "Mokinys" is masculine nominative → adjective must be masculine nominative: geras. "Gera" is feminine nominative. Rule: masculine nominative adjectives end in -as/-us/-is.'],
      ['Ji perka ___ suknelę.',['nauja','naują','naujos','naujai'],1,
        '"Perka" (buys) takes accusative: suknelę (feminine accusative). The adjective must also be feminine accusative: nauja (nominative) → naują (accusative, -a → -ą). Adjectives follow the same case endings as the noun they describe.'],
      ['Aš turiu ___ šunį.',['didelį','didelio','dideliam','didelė'],0,
        '"Turiu" takes accusative. Šuo/šunis (dog) accusative: šunį (masculine). Adjective didelis (big) in masculine accusative: didelį (-is → -į). The adjective mirrors the noun ending exactly.'],
      ['Jie gyvena ___ name.',['gražiam','gražiame','gražaus','gražų'],1,
        'Locative masculine: namas → name. Adjective must be masculine locative: gražus → gražiame (-us → -iame). The -iame ending is the masculine locative for -us adjectives. "Gražiam" is dative.'],
      ['Mes matome ___ kalną.',['aukšto','aukštam','aukštą','aukštame'],2,
        'Accusative masculine: kalnas → kalną. Adjective aukštas (tall/high) in masculine accusative: aukštą (-as → -ą). The adjective ends in -ą just like the noun kalną.'],
      ['Ji nešioja ___ suknelę.',['raudona','raudoną','raudonos','raudonai'],1,
        'Accusative feminine: suknelę. Adjective raudonas/raudona (red) in feminine accusative: raudoną (-a → -ą). Feminine adjectives in accusative always end in -ą, matching the noun ending.'],
      ['Aš noriu ___ obuolio.',['didelis','didelį','didelio','dideliam'],2,
        '"Noriu" (I want) governs genitive: obuolys → obuolio. The adjective must also be genitive masculine: didelis → didelio (-is → -io). Both the noun and adjective must be in the same case: genitive.'],
      ['Tai yra ___ miestas.',['gražus','gražų','gražaus','gražiame'],0,
        '"Miestas" is masculine nominative. After "yra" (is) in a naming/describing sentence, the predicate adjective is nominative: gražus. The -us ending marks masculine nominative for this adjective type (like the noun -as type).'],
      ['Jis turi ___ katę.',['juodas','juodą','juodos','juodai'],1,
        '"Turi" takes accusative. Katė (cat) is feminine, accusative: katę (-ė → -ę). Adjective juodas (black) in feminine accusative: juodą. Wait — the feminine form of juodas is juoda, and its accusative is juodą (-a → -ą). The adjective agrees with the feminine noun.'],
      ['Mes valgome ___ duoną.',['šviežias','šviežią','šviežios','šviežiai'],1,
        'Accusative feminine: duona → duoną. Adjective šviežias (fresh) in feminine accusative: šviežią (-ias → -ią). For -ias adjectives, feminine accusative drops -ias and adds -ią. Adjective agrees with the noun duoną.'],
      // Įvardžiai (pronouns)
      ['___ esu studentas.',['Tu','Jis','Aš','Ji'],2,
        'The verb form "esu" is exclusively 1st person singular → subject must be "aš" (I). Each person has a unique verb form: aš esu, tu esi, jis/ji yra, mes esame, jūs esate, jie/jos yra. "Esu" can only be used with "aš".'],
      ['Ar ___ kalbate lietuviškai?',['tu','jis','jūs','mes'],2,
        '"Kalbate" is 2nd person plural → subject is "jūs" (you plural/formal). Conjugation: aš kalbu, tu kalbi, jis/ji kalba, mes kalbame, jūs kalbate. The -ate ending always marks 2nd person plural.'],
      ['Kur yra ___ knyga? (jo)',['mano','tavo','jo','jos'],2,
        'The hint "(jo)" tells you the answer. "Jo" is the genitive of "jis" (he), used as a possessive: his book = jo knyga. Possessives: mano (my), tavo (your), jo (his), jos (her), mūsų (our), jūsų (your pl.), jų (their).'],
      ['Aš daviau ___ laišką. (jai)',['jam','jai','jiems','joms'],1,
        'The hint "(jai)" tells you the answer. "Jai" is the dative of "ji" (she): to her. "Daviau jai" = I gave to her. Dative pronouns: man (to me), tau (to you), jam (to him), jai (to her), mums (to us), jums (to you pl.).'],
      ['___ esame čia kartu.',['Aš','Tu','Jis','Mes'],3,
        '"Esame" is 1st person plural → subject is "mes" (we). Būti conjugation: aš esu, tu esi, jis/ji yra, mes esame, jūs esate, jie/jos yra. The -ame ending marks 1st person plural.'],
      ['Tai yra ___ namas. (mūsų)',['mano','tavo','mūsų','jūsų'],2,
        'The hint "(mūsų)" tells you the answer. "Mūsų" is the genitive of "mes" (we), used as a possessive: our house = mūsų namas. Possessives do NOT change form by case — mūsų namas, mūsų namo, mūsų namui all use "mūsų".'],
      ['Ar ___ supranti lietuviškai?',['aš','tu','jis','mes'],1,
        '"Supranti" is 2nd person singular → subject is "tu" (you singular). Conjugation: aš suprantu, tu supranti, jis/ji supranta. The -i ending (in some verbs -nti specifically) marks 2nd person singular.'],
      ['Ji pasakė ___ apie tai. (man)',['man','tau','jam','jai'],0,
        'The hint "(man)" tells you the answer. "Man" is the dative of "aš" (I): to me. "Pasakė man" = she told me. The dative of personal pronouns: man/tau/jam/jai/mums/jums/jiems/joms.'],
      // Prielinksniai (prepositions)
      ['Aš einu ___ parduotuvę.',['iš','į','ant','po'],1,
        '"Į" (into/to) with accusative indicates movement toward a place. "Einu į parduotuvę" = I am going to the shop. Key rule: į + accusative = direction of movement. Compare: "iš" (from) shows departure.'],
      ['Jis ateina ___ mokyklos.',['į','iš','ant','prie'],1,
        '"Iš" (from/out of) with genitive indicates origin or departure. "Ateina iš mokyklos" = comes from school. Rule: iš + genitive = movement away from. "Į mokyklą" (to school) vs "iš mokyklos" (from school).'],
      ['Knyga yra ___ stalo.',['ant','į','iš','po'],0,
        '"Ant" (on top of) with genitive indicates position on a surface. "Knyga ant stalo" = the book is on the table. Rule: ant + genitive. Compare: "po stalu" (under the table), "prie stalo" (at the table).'],
      ['Mes sėdime ___ stalo.',['ant','prie','iš','į'],1,
        '"Prie" (next to/at/by) with genitive indicates proximity or position near something. "Sėdime prie stalo" = we sit at the table. Rule: prie + genitive. "Ant stalo" = on the table (surface contact).'],
      ['Autobusas atvyksta ___ Kauno.',['į','iš','prie','ant'],1,
        '"Iš" + genitive = from (point of origin). "Atvyksta iš Kauno" = arrives from Kaunas. Rule: direction FROM uses "iš" + genitive. Direction TO uses "į" + accusative: "atvyksta į Vilnių" (arrives in Vilnius).'],
      ['Jis gyvena ___ Vilniaus.',['į','iš','netoli','ant'],2,
        '"Netoli" (not far from/near) + genitive indicates proximity to a place. "Gyvena netoli Vilniaus" = lives near Vilnius. Other proximity prepositions: šalia (next to), prie (by), aplink (around) — all take genitive.'],
      ['Vaikai žaidžia ___ namo.',['į','ant','prie','šalia'],3,
        '"Šalia" (next to/beside/alongside) + genitive indicates being beside something. "Žaidžia šalia namo" = play beside the house. Compare: "prie namo" (by the house/at the door) vs "šalia namo" (alongside the house).'],
      // Klausiamieji žodžiai (question words)
      ['___ tavo vardas?',['Kur','Kada','Koks','Kiek'],2,
        '"Koks" (what/which kind, masculine) is used with masculine nouns when asking about identity or quality. "Vardas" is masculine → "Koks tavo vardas?" (What is your name?). Feminine version: "Kokia tavo pavardė?" (What is your surname?).'],
      ['___ tu gyveni?',['Koks','Kur','Kada','Kiek'],1,
        '"Kur" (where) asks about location. "Kur tu gyveni?" = Where do you live? Other question words: kas (who/what), kada (when), kiek (how much/many), koks (what kind), kaip (how).'],
      ['___ prasideda filmas?',['Kur','Koks','Kada','Kas'],2,
        '"Kada" (when) asks about time. "Kada prasideda filmas?" = When does the film start? Lithuanian question words: kas (who/what), kur (where), kada (when), kiek (how much), kaip (how), kodėl (why).'],
      ['___ kainuoja bilietas?',['Kur','Koks','Kada','Kiek'],3,
        '"Kiek" (how much/how many) asks about price, quantity, or amount. "Kiek kainuoja bilietas?" = How much does the ticket cost? Also used for age: "Kiek tau metų?" (How old are you?).'],
      ['___ tu dirbi?',['Kur','Kada','Kiek','Koks'],0,
        '"Kur" (where) asks about the location of an action. "Kur tu dirbi?" = Where do you work? Use "kur" for locations and directions. Compare: "Kada dirbi?" (When do you work?) vs "Kur dirbi?" (Where do you work?).'],
    ];
    for (let i = 0; i < g.length; i++) {
      const [content, opts, ci, explanation] = g[i];
      await createQ({ examId: eId, content, type: 'MULTIPLE_CHOICE', skill: 'GRAMMAR',
        order: i + 301, variantSet: 'grammar_pool', explanation,
        opts: simple(opts, ci) });
    }
  }

  // ============================================================
  // CONSTITUTION EXAM — 20 questions, no variantSet/taskType
  // ============================================================
  {
    const c: [string, string[], number][] = [
      ['Kada buvo priimta Lietuvos Respublikos Konstitucija?',
        ['1990 m. kovo 11 d.','1992 m. spalio 25 d.','1918 m. vasario 16 d.','1991 m. rugpjūčio 23 d.'],1],
      ['Kas yra Lietuvos valstybės sostinė?',
        ['Kaunas','Klaipėda','Vilnius','Šiauliai'],2],
      ['Kas yra aukščiausiasis įstatymų leidžiamosios valdžios organas Lietuvoje?',
        ['Prezidentas','Seimas','Vyriausybė','Konstitucinis Teismas'],1],
      ['Kiek narių turi Lietuvos Seimas?',
        ['100','111','141','200'],2],
      ['Kokie yra Lietuvos valstybės simboliai?',
        ['Himnas, herbas ir vėliava','Himnas ir vėliava','Herbas ir vėliava','Tik vėliava'],0],
      ['Kokia yra Lietuvos vėliavos spalvų tvarka iš viršaus į apačią?',
        ['Raudona, žalia, geltona','Geltona, žalia, raudona','Žalia, geltona, raudona','Raudona, geltona, žalia'],1],
      ['Kada Lietuva atkūrė nepriklausomybę?',
        ['1988 m.','1989 m.','1990 m.','1991 m.'],2],
      ['Kaip Konstitucijoje apibūdinama Lietuvos valstybė?',
        ['Monarchija','Nepriklausoma demokratinė respublika','Federacinė valstybė','Socialistinė valstybė'],1],
      ['Kas yra Lietuvos ginkluotųjų pajėgų vadas?',
        ['Seimo pirmininkas','Ministras pirmininkas','Prezidentas','Gynybos ministras'],2],
      ['Kiek metų yra Lietuvos Respublikos Prezidento kadencija?',
        ['3 metai','4 metai','5 metai','6 metai'],2],
      ['Kas yra Lietuvos nacionalinis himnas?',
        ['"Tautiška giesmė"','"Lietuva brangi"','"Kur giria žaliuoja"','"Ant kalno mūrai"'],0],
      ['Kada Lietuva įstojo į Europos Sąjungą?',
        ['2000 m.','2002 m.','2004 m.','2007 m.'],2],
      ['Kas turi teisę rinkti Seimą?',
        ['Visi piliečiai nuo 16 metų','Lietuvos piliečiai nuo 18 metų','Tik Lietuvoje gimę piliečiai','Visi Europoje gyvenantys lietuviai'],1],
      ['Kiek laiko galioja Seimo narių įgaliojimai?',
        ['3 metai','4 metai','5 metai','6 metai'],1],
      ['Kas gali tapti Lietuvos Prezidentu?',
        ['Bet kuris pilietis nuo 18 metų','Pilietis nuo gimimo, gyvenantis Lietuvoje ne mažiau kaip 3 metus','Pilietis nuo 40 metų, gyvenantis Lietuvoje ne mažiau kaip 10 metų','Tik Lietuvoje gimęs pilietis'],2],
      ['Kas yra Lietuvos herbo pavadinimas?',
        ['Lietuvis','Vytis','Gedimino stulpai','Vilnius'],1],
      ['Kas pasirašė Nepriklausomybės Aktą 1918 m. vasario 16 d.?',
        ['Antanas Smetona','Aleksandras Stulginskis','Lietuvos Taryba','Steigiamasis Seimas'],2],
      ['Pagal Konstituciją, kam priklauso valdžia Lietuvoje?',
        ['Prezidentui','Seimui','Tautai','Vyriausybei'],2],
      ['Kada Lietuva tapo NATO nare?',
        ['2000 m.','2002 m.','2004 m.','2006 m.'],2],
      ['Koks yra Konstitucinio Teismo narių skaičius?',
        ['7','9','11','13'],1],
    ];
    for (let i = 0; i < c.length; i++) {
      const [content, opts, ci] = c[i];
      await createQ({ examId: cId, content, type: 'MULTIPLE_CHOICE', skill: 'READING',
        order: i + 1, opts: simple(opts, ci) });
    }
  }

  console.log('Seeding completed successfully!');
  console.log('  - A2 exam: 3x reading (84 q) + 2x listening (20 q) + writing pool (9 q) + grammar pool (75 q)');
  console.log('  - Constitution exam: 20 questions');
}

main().catch(console.error).finally(() => prisma.$disconnect());
