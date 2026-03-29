import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const QUESTIONS = [
  {
    order: 21,
    content: 'Kiek straipsnių yra Lietuvos Respublikos Konstitucijoje?',
    explanation: 'Lietuvos Respublikos Konstitucijoje yra 154 straipsniai, suskirstyti į 14 skyrių.',
    answer: '154',
    options: ['100', '128', '154', '167'],
  },
  {
    order: 22,
    content: 'Kiek skyrių yra Lietuvos Respublikos Konstitucijoje?',
    explanation: 'Konstitucija sudaryta iš 14 skyrių, pradedant I skyriumi „Lietuvos valstybė" ir baigiant XIV skyriumi „Konstitucijos keitimas".',
    answer: '14',
    options: ['10', '12', '14', '16'],
  },
  {
    order: 23,
    content: 'Kada buvo priimta Lietuvos Respublikos Konstitucija?',
    explanation: 'Lietuvos Respublikos Konstitucija buvo priimta referendumu 1992 m. spalio 25 d.',
    answer: '1992 m. spalio 25 d.',
    options: ['1990 m. kovo 11 d.', '1992 m. spalio 25 d.', '1991 m. vasario 16 d.', '1993 m. sausio 1 d.'],
  },
  {
    order: 24,
    content: 'Kas pagal Konstitucijos 2 str. sukuria Lietuvos valstybę?',
    explanation: 'Pagal Konstitucijos 2 straipsnį, Lietuvos valstybę kuria Tauta, o suverenitetas priklauso Tautai.',
    answer: 'Tauta',
    options: ['Seimas', 'Prezidentas', 'Tauta', 'Vyriausybė'],
  },
  {
    order: 25,
    content: 'Kam priklauso suverenitetas pagal Konstitucijos 2 str.?',
    explanation: 'Konstitucijos 2 straipsnis skelbia, kad suverenitetas priklauso Tautai.',
    answer: 'Tautai',
    options: ['Seimui', 'Prezidentui', 'Tautai', 'Vyriausybei'],
  },
  {
    order: 26,
    content: 'Koks yra minimalus Seimo nario amžius?',
    explanation: 'Pagal Konstitucijos 56 straipsnį, Seimo nariu gali būti renkamas asmuo, kuriam ne mažiau kaip 25 metai.',
    answer: '25 metai',
    options: ['18 metų', '21 metai', '25 metai', '30 metų'],
  },
  {
    order: 27,
    content: 'Kiek narių turi Seimas?',
    explanation: 'Pagal Konstitucijos 55 straipsnį, Seimą sudaro 141 Seimo narys.',
    answer: '141',
    options: ['100', '121', '141', '151'],
  },
  {
    order: 28,
    content: 'Kiek metų renkami Seimo nariai?',
    explanation: 'Konstitucijos 55 straipsnis nustato, kad Seimo nariai renkami ketveriems metams.',
    answer: '4 metams',
    options: ['2 metams', '4 metams', '5 metams', '6 metams'],
  },
  {
    order: 29,
    content: 'Koks yra minimalus Respublikos Prezidento amžius?',
    explanation: 'Konstitucijos 78 straipsnis nustato, kad Prezidentu gali būti renkamas asmuo, kuriam iki rinkimų dienos yra suėję ne mažiau kaip 40 metų.',
    answer: '40 metų',
    options: ['30 metų', '35 metai', '40 metų', '45 metai'],
  },
  {
    order: 30,
    content: 'Kiek metų renkami Respublikos Prezidentas?',
    explanation: 'Pagal Konstitucijos 78 straipsnį, Prezidentas renkamas penkeriems metams.',
    answer: '5 metams',
    options: ['4 metams', '5 metams', '6 metams', '7 metams'],
  },
  {
    order: 31,
    content: 'Kiek kartų iš eilės tas pats asmuo gali būti išrinktas Respublikos Prezidentu?',
    explanation: 'Konstitucijos 78 straipsnis draudžia tam pačiam asmeniui būti išrinktam Prezidentu daugiau kaip du kartus iš eilės.',
    answer: 'Ne daugiau kaip du kartus iš eilės',
    options: ['Vieną kartą', 'Ne daugiau kaip du kartus iš eilės', 'Tris kartus', 'Neribotai'],
  },
  {
    order: 32,
    content: 'Koks Lietuvos Respublikos himnas?',
    explanation: 'Konstitucijos 16 straipsnis nustato, kad valstybės himnas yra „Tautiška giesmė".',
    answer: 'Tautiška giesmė',
    options: ['Lietuva brangi', 'Tautiška giesmė', 'Kur bėga Šešupė', 'Ąžuolai'],
  },
  {
    order: 33,
    content: 'Kas sukūrė Lietuvos himną?',
    explanation: 'Pagal Konstitucijos 16 straipsnį, valstybės himnas yra Vinco Kudirkos „Tautiška giesmė".',
    answer: 'Vincas Kudirka',
    options: ['Jonas Mačiulis-Maironis', 'Vincas Kudirka', 'Bernardas Brazdžionis', 'Kristijonas Donelaitis'],
  },
  {
    order: 34,
    content: 'Kokios yra Lietuvos valstybinės vėliavos spalvos?',
    explanation: 'Konstitucijos 15 straipsnis nustato, kad valstybinės vėliavos spalvos yra geltona, žalia ir raudona.',
    answer: 'Geltona, žalia ir raudona',
    options: ['Mėlyna, balta ir raudona', 'Geltona, žalia ir raudona', 'Žalia, balta ir raudona', 'Raudona, balta ir žalia'],
  },
  {
    order: 35,
    content: 'Koks yra Lietuvos valstybinis herbas?',
    explanation: 'Konstitucijos 15 straipsnis nustato, kad valstybės herbas yra baltas Vytis raudoname lauke.',
    answer: 'Baltas Vytis raudoname lauke',
    options: ['Geltonas erelis mėlyname lauke', 'Baltas Vytis raudoname lauke', 'Raudonas Vytis baltame lauke', 'Žalias Vytis baltame lauke'],
  },
  {
    order: 36,
    content: 'Kas yra Lietuvos Respublikos sostinė pagal Konstituciją?',
    explanation: 'Konstitucijos 17 straipsnis nurodo, kad Lietuvos Respublikos sostinė yra Vilnius.',
    answer: 'Vilnius',
    options: ['Kaunas', 'Vilnius', 'Šiauliai', 'Klaipėda'],
  },
  {
    order: 37,
    content: 'Koks yra Lietuvos Respublikos valstybinė kalba?',
    explanation: 'Konstitucijos 14 straipsnis nustato, kad valstybinė kalba yra lietuvių kalba.',
    answer: 'Lietuvių kalba',
    options: ['Anglų kalba', 'Lenkų kalba', 'Lietuvių kalba', 'Rusų kalba'],
  },
  {
    order: 38,
    content: 'Nuo kokio amžiaus piliečiai turi rinkimų teisę?',
    explanation: 'Konstitucijos 34 straipsnis suteikia rinkimų teisę piliečiams, kuriems rinkimų dieną yra sukakę 18 metų.',
    answer: 'Nuo 18 metų',
    options: ['Nuo 16 metų', 'Nuo 18 metų', 'Nuo 20 metų', 'Nuo 21 metų'],
  },
  {
    order: 39,
    content: 'Kokie organai vykdo valstybės valdžią Lietuvoje pagal Konstitucijos 5 str.?',
    explanation: 'Konstitucijos 5 straipsnis nustato, kad valstybės valdžią vykdo Seimas, Respublikos Prezidentas ir Vyriausybė, Teismas.',
    answer: 'Seimas, Prezidentas ir Vyriausybė, Teismas',
    options: ['Tik Seimas', 'Seimas ir Prezidentas', 'Seimas, Prezidentas ir Vyriausybė, Teismas', 'Seimas, Prezidentas ir Teismas'],
  },
  {
    order: 40,
    content: 'Kas pagal Konstituciją yra visuomenės ir valstybės pagrindas?',
    explanation: 'Konstitucijos 38 straipsnis skelbia, kad šeima yra visuomenės ir valstybės pagrindas.',
    answer: 'Šeima',
    options: ['Tauta', 'Šeima', 'Religija', 'Parlamentas'],
  },
  {
    order: 41,
    content: 'Kiek parašų reikia referendumui paskelbti piliečių iniciatyva?',
    explanation: 'Konstitucijos 9 straipsnis nurodo, kad referendumas skelbiamas, kai to reikalauja ne mažiau kaip 300 000 rinkimų teisę turinčių piliečių.',
    answer: '300 000 piliečių',
    options: ['100 000 piliečių', '200 000 piliečių', '300 000 piliečių', '500 000 piliečių'],
  },
  {
    order: 42,
    content: 'Kiek parašų reikia, kad piliečiai galėtų pateikti įstatymo projektą Seimui?',
    explanation: 'Konstitucijos 68 straipsnis nustato, kad 50 000 rinkimų teisę turinčių piliečių turi teisę pateikti įstatymo projektą Seimui.',
    answer: '50 000 piliečių',
    options: ['10 000 piliečių', '50 000 piliečių', '100 000 piliečių', '300 000 piliečių'],
  },
  {
    order: 43,
    content: 'Kiek teisėjų yra Konstituciniame Teisme?',
    explanation: 'Konstitucijos 103 straipsnis nustato, kad Konstitucinį Teismą sudaro 9 teisėjai.',
    answer: '9 teisėjai',
    options: ['5 teisėjai', '7 teisėjai', '9 teisėjai', '12 teisėjai'],
  },
  {
    order: 44,
    content: 'Kiek metų skiriami Konstitucinio Teismo teisėjai?',
    explanation: 'Konstitucijos 103 straipsnis nustato, kad Konstitucinio Teismo teisėjai skiriami devyneriems metams.',
    answer: '9 metams',
    options: ['5 metams', '7 metams', '9 metams', '12 metų'],
  },
  {
    order: 45,
    content: 'Iš ko rekrutuojami Konstitucinio Teismo teisėjai?',
    explanation: 'Konstitucijos 103 straipsnis nustato, kad po 3 teisėjus skiria Prezidentas, Seimo Pirmininkas ir Aukščiausiojo Teismo Pirmininkas.',
    answer: 'Po 3 skiria Prezidentas, Seimo Pirmininkas ir Aukščiausiojo Teismo Pirmininkas',
    options: ['Visus skiria Prezidentas', 'Visus skiria Seimas', 'Po 3 skiria Prezidentas, Seimo Pirmininkas ir Aukščiausiojo Teismo Pirmininkas', 'Po 3 skiria Seimas, Prezidentas ir Vyriausybė'],
  },
  {
    order: 46,
    content: 'Kaip Konstitucijoje apibūdinamos žmogaus teisės ir laisvės?',
    explanation: 'Konstitucijos 18 straipsnis skelbia, kad žmogaus teisės ir laisvės yra prigimtinės.',
    answer: 'Prigimtinės',
    options: ['Suteikiamos valstybės', 'Prigimtinės', 'Įtvirtintos įstatymais', 'Sutartinės'],
  },
  {
    order: 47,
    content: 'Ką draudžia Konstitucijos 44 str.?',
    explanation: 'Konstitucijos 44 straipsnis draudžia masinės informacijos cenzūrą ir neleidžia valstybei ar politinėms partijoms monopolizuoti žiniasklaidos.',
    answer: 'Masinės informacijos cenzūrą',
    options: ['Opozicines partijas', 'Masinės informacijos cenzūrą', 'Streikus', 'Religiją'],
  },
  {
    order: 48,
    content: 'Kokia yra Konstitucijos 31 str. nustatyta prezumpcija?',
    explanation: 'Konstitucijos 31 straipsnis įtvirtina nekaltumo prezumpciją – asmuo laikomas nekaltu, kol jo kaltumas neįrodytas įstatymo nustatyta tvarka.',
    answer: 'Nekaltumo prezumpcija',
    options: ['Kaltės prezumpcija', 'Nekaltumo prezumpcija', 'Sutarties prezumpcija', 'Teisingumo prezumpcija'],
  },
  {
    order: 49,
    content: 'Kokia ūkio forma nustatyta Konstitucijos 46 str.?',
    explanation: 'Konstitucijos 46 straipsnis nustato, kad Lietuvos ūkis grindžiamas privačios nuosavybės teise ir laisva ūkine veikla bei iniciatyva.',
    answer: 'Pagrįsta privačios nuosavybės teise ir laisva ūkine veikla',
    options: ['Planinė ekonomika', 'Valstybinė nuosavybė', 'Pagrįsta privačios nuosavybės teise ir laisva ūkine veikla', 'Mišri valstybinė ir privati ekonomika'],
  },
  {
    order: 50,
    content: 'Kam priklauso žemės gelmės, vidaus vandenys, miškai pagal Konstituciją?',
    explanation: 'Konstitucijos 47 straipsnis nustato, kad žemės gelmės, vidaus vandenys, miškai ir kiti svarbūs objektai priklauso Lietuvos Respublikai išimtine nuosavybės teise.',
    answer: 'Lietuvos Respublikai išimtine nuosavybės teise',
    options: ['Privatiems asmenims', 'Savivaldybėms', 'Lietuvos Respublikai išimtine nuosavybės teise', 'Europos Sąjungai'],
  },
  {
    order: 51,
    content: 'Kada prasideda ir baigiasi Seimo pavasario sesija?',
    explanation: 'Konstitucijos 64 straipsnis nustato, kad Seimo pavasario sesija vyksta kovo 10 d. – birželio 30 d.',
    answer: 'Kovo 10 d. – birželio 30 d.',
    options: ['Sausio 15 d. – birželio 15 d.', 'Kovo 10 d. – birželio 30 d.', 'Vasario 1 d. – birželio 30 d.', 'Kovo 1 d. – liepos 31 d.'],
  },
  {
    order: 52,
    content: 'Kada prasideda ir baigiasi Seimo rudens sesija?',
    explanation: 'Konstitucijos 64 straipsnis nustato, kad Seimo rudens sesija vyksta rugsėjo 10 d. – gruodžio 23 d.',
    answer: 'Rugsėjo 10 d. – gruodžio 23 d.',
    options: ['Rugsėjo 1 d. – gruodžio 31 d.', 'Rugsėjo 10 d. – gruodžio 23 d.', 'Spalio 1 d. – sausio 15 d.', 'Rugsėjo 15 d. – gruodžio 15 d.'],
  },
  {
    order: 53,
    content: 'Kas vadovauja Valstybės gynybos tarybai?',
    explanation: 'Konstitucijos 140 straipsnis nustato, kad Valstybės gynybos tarybai vadovauja Respublikos Prezidentas.',
    answer: 'Respublikos Prezidentas',
    options: ['Seimo Pirmininkas', 'Respublikos Prezidentas', 'Ministras Pirmininkas', 'Gynybos ministras'],
  },
  {
    order: 54,
    content: 'Kas yra Ginkluotųjų Pajėgų Vyriausiasis Vadas?',
    explanation: 'Konstitucijos 140 straipsnis nustato, kad Respublikos Prezidentas yra Ginkluotųjų Pajėgų Vyriausiasis Vadas.',
    answer: 'Respublikos Prezidentas',
    options: ['Gynybos ministras', 'Kariuomenės vadas', 'Respublikos Prezidentas', 'Seimo Pirmininkas'],
  },
  {
    order: 55,
    content: "Kaip galima pakeisti Konstitucijos 1 str. 'nepriklausoma demokratinė respublika'?",
    explanation: 'Konstitucijos 148 straipsnis nustato, kad 1 straipsnis gali būti keičiamas tik referendumu, jei ne mažiau kaip 3/4 rinkimų teisę turinčių piliečių balsuoja „už".',
    answer: "Tik referendumu, jei 3/4 rinkimų teisę turinčių piliečių balsuoja 'už'",
    options: ['Seimo balsavimu 2/3 balsų dauguma', "Referendumu, jei 1/2 balsuoja 'už'", "Tik referendumu, jei 3/4 rinkimų teisę turinčių piliečių balsuoja 'už'", 'Prezidento dekretu'],
  },
  {
    order: 56,
    content: 'Kas yra Ministerijų Pirmininkas pagal Konstituciją?',
    explanation: 'Konstitucijos 92 straipsnis nustato, kad Ministrą Pirmininką skiria Prezidentas, pritarus Seimui.',
    answer: 'Ministras Pirmininkas, skiriamas Prezidento pritarus Seimui',
    options: ['Tiesiogiai renkamas piliečių', 'Seimo skiriamas be Prezidento', 'Ministras Pirmininkas, skiriamas Prezidento pritarus Seimui', 'Prezidento skiriamas be Seimo'],
  },
  {
    order: 57,
    content: 'Kokia yra asmens sulaikymo procedūra pagal Konstitucijos 20 str.?',
    explanation: 'Konstitucijos 20 straipsnis nustato, kad sulaikytasis per 48 valandas turi būti pristatytas į teismą.',
    answer: 'Per 48 valandas sulaikytasis turi būti pristatytas į teismą',
    options: ['Per 24 valandas', 'Per 48 valandas sulaikytasis turi būti pristatytas į teismą', 'Per 72 valandas', 'Per 7 dienas'],
  },
  {
    order: 58,
    content: 'Ką draudžia Konstitucija dėl užsienio karinių bazių?',
    explanation: 'Konstitucijos 137 straipsnis draudžia užsienio karines bazes Lietuvos teritorijoje.',
    answer: 'Draudžia užsienio karines bazes Lietuvos teritorijoje',
    options: ['Leidžia su Seimo sutikimu', 'Draudžia užsienio karines bazes Lietuvos teritorijoje', 'Leidžia su NATO sutikimu', 'Leidžia su Prezidento dekretu'],
  },
  {
    order: 59,
    content: 'Koks yra Valstybės kontrolieriaus kadencijos terminas?',
    explanation: 'Konstitucijos 133 straipsnis nustato, kad Valstybės kontrolierius skiriamas penkerių metų kadencijai.',
    answer: '5 metai',
    options: ['3 metai', '4 metai', '5 metai', '6 metai'],
  },
  {
    order: 60,
    content: 'Iki kokio amžiaus mokslas yra privalomas Lietuvoje?',
    explanation: 'Konstitucijos 41 straipsnis nustato, kad iki 16 metų mokslas yra privalomas.',
    answer: 'Iki 16 metų',
    options: ['Iki 14 metų', 'Iki 16 metų', 'Iki 18 metų', 'Iki 21 metų'],
  },
]

async function main() {
  console.log('🔍 Looking for Lithuanian Constitution exam...')

  const exam = await prisma.exam.findFirst({
    where: {
      title: {
        contains: 'Konstitucij',
        mode: 'insensitive',
      },
    },
  })

  if (!exam) {
    console.error('❌ Could not find a Constitution exam. Please create the exam first.')
    process.exit(1)
  }

  console.log(`✅ Found exam: "${exam.title}" (id: ${exam.id})`)
  console.log(`📝 Adding ${QUESTIONS.length} new questions starting at order 21...`)

  for (const q of QUESTIONS) {
    await prisma.question.create({
      data: {
        examId: exam.id,
        type: 'MULTIPLE_CHOICE',
        skill: 'READING',
        content: q.content,
        explanation: q.explanation,
        order: q.order,
        points: 1,
        options: {
          create: q.options.map((opt, idx) => ({
            content: opt,
            isCorrect: opt === q.answer,
            order: idx,
          })),
        },
      },
    })
    console.log(`  ✓ Q${q.order}: ${q.content.slice(0, 60)}…`)
  }

  console.log(`\n🎉 Successfully added ${QUESTIONS.length} questions to "${exam.title}"!`)
}

main()
  .catch(err => {
    console.error('❌ Error:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
