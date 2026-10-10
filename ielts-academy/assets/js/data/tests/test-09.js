/* Practice Test 9 — original IELTS-style material. */
(function () {
  const { gap, mcq, multi, tf, yn, sel, box, roman, part } = window.TB;

  /* Plan for Part 2, questions 16–20 (the entrance is at the bottom; you face the stage). */
  function hallPlan() {
    const pin = (l, x, y) => `<g class="map-pin"><circle cx="${x}" cy="${y}" r="13"/><text x="${x}" y="${y + 4.5}" text-anchor="middle">${l}</text></g>`;
    return `<div class="map-wrap"><svg viewBox="0 0 600 370" role="img" aria-label="Plan of the Great Hall with stands labelled A to H">
      <rect class="map-feature" x="40" y="30" width="520" height="300" rx="8" style="fill:var(--paper);stroke-width:2.5"/>
      <rect class="map-feature" x="220" y="40" width="160" height="40" rx="4"/><text class="map-label" x="300" y="65" text-anchor="middle">Stage</text>
      <rect class="map-feature" x="50" y="140" width="80" height="80" rx="4"/><text class="map-label" x="90" y="184" text-anchor="middle">Café</text>
      <rect class="map-feature" x="262" y="276" width="76" height="26" rx="4"/><text class="map-label" x="300" y="294" text-anchor="middle" style="font-size:10px">Information</text>
      <rect fill="var(--bg)" x="270" y="326" width="60" height="8"/>
      <text class="map-label" x="300" y="358" text-anchor="middle" style="font-weight:800">▲ Main entrance</text>
      ${pin("A", 105, 290)}${pin("B", 495, 290)}${pin("C", 180, 180)}${pin("D", 300, 185)}
      ${pin("E", 420, 185)}${pin("F", 100, 70)}${pin("G", 500, 70)}${pin("H", 300, 112)}
    </svg></div>`;
  }

  window.IELTS_TESTS[9] = {
    listening: {
      parts: [
        part(1, "Part 1 · Ordering food for a party", "A woman phones a catering company to order food for a party.", ["Ben (caterer)", "Lena (customer)"], [
          [0, "Taste Catering, Ben speaking."],
          [1, "Hi. I'd like to order some food for a party."],
          [0, "Certainly. Can I take your name first?"],
          [1, "Lena Fischer. That's [[F, I, S, C, H, E, R]]."],
          [0, "Thanks, Lena. What kind of party is it?"],
          [1, "It's a [[retirement]] party for my father. We had a big birthday party for him last year, so this one's a bit smaller."],
          [0, "And how many guests are you expecting?"],
          [1, "We've invited forty, but my father keeps adding people, so let's say [[forty-five]] to be safe."],
          [0, "OK, forty-five. And the date?"],
          [1, "It's Saturday the [[twenty-fourth]] of May."],
          [0, "And where will it be?"],
          [1, "At the [[Church]] Hall on Station Road. We wanted the Community Centre, but it was already booked."],
          [0, "I know the Church Hall well. Now, we have three buffet menus: Classic British, Asian and Mediterranean."],
          [1, "My father loves Asian food, but half the guests don't like spicy dishes, so I think the [[Mediterranean]] buffet is the safest choice."],
          [0, "Good choice. Will there be any vegetarians?"],
          [1, "Yes, about ten. Actually, my cousin just told me her family are all vegetarian, so make it [[twelve]]."],
          [0, "No problem. And for dessert, the Mediterranean menu comes with chocolate cake and fresh [[fruit]]."],
          [1, "Lovely. How much does it come to?"],
          [0, "It's [[eighteen pounds fifty]] per person, which includes plates, cutlery and serving staff."],
          [1, "That's fine. Do you need a deposit?"],
          [0, "Yes, twenty per cent, and it must be paid at least [[fourteen]] days before the event. The rest is due on the day."],
          [1, "OK. Thanks very much."],
        ]),
        part(2, "Part 2 · A university careers fair", "A careers adviser gives students information about a careers fair.", ["Ruth (careers adviser)"], [
          [0, "Hello, everyone. I'm Ruth Okoye from the Careers Service, and I'd like to tell you about next Wednesday's careers fair."],
          [0, "First, the location. For the last few years the fair has been held in the sports centre, but this year it's moving to the [[Great Hall]] in the main building, which is much easier to find."],
          [0, "We were hoping to attract eighty employers, and in the end [[sixty]] have confirmed, which still makes it our biggest fair ever."],
          [0, "What should you bring? You don't need printed copies of your CV, because most employers will scan a QR code on your phone. But you must bring your [[student ID card]], as it will be checked at the door."],
          [0, "There'll be short talks on the stage [[every hour]], starting at ten o'clock, on topics such as applying for internships and preparing for interviews."],
          [0, "And after the fair, please complete our online [[survey]]. Everyone who does so will be entered into a prize draw for a new tablet."],
          [0, "Now, let me show you the layout of the hall on the plan. You'll come in through the main entrance at the bottom of the plan, and the information desk is straight ahead of you."],
          [0, "If you'd like someone to look at your CV, the [[CV advice]] service will be in the corner immediately to your left as you come in."],
          [0, "In the opposite corner, on your right as you enter, you'll find the employers from the [[health sector]], the hospitals and care organisations."],
          [0, "The [[engineering]] companies have the largest stands, so they'll be in the far right-hand corner, at the top of the plan."],
          [0, "Schools and other [[education]] employers will be on the left-hand side of the hall, just beside the café."],
          [0, "And the [[volunteering]] organisations will be right in the middle at the front, directly in front of the stage, as they're giving a short presentation at twelve. The technology firms will be in the centre of the hall, but they're not on your handout because the list isn't final yet."],
        ]),
        part(3, "Part 3 · A recycling project", "Two students, Amira and Josh, discuss their project on recycling in student halls.", ["Amira (student)", "Josh (student)"], [
          [0, "Josh, shall we go through the results of our recycling project?"],
          [1, "Sure. The survey of students in halls was really revealing. I'd assumed the main problem would be that the bins were too far away."],
          [0, "Me too, but hardly anyone mentioned that. The main finding was that [[students are confused about what can be recycled]]. Most of them want to recycle; they just don't know the rules."],
          [1, "And when we looked in the bins, the biggest problem was [[takeaway containers]]. Paper and food packaging were mostly OK, but people kept putting greasy pizza boxes and plastic takeaway boxes in the recycling."],
          [0, "Then there was the trial in Block C."],
          [1, "Yes, that was disappointing. The new signs stayed up and the bins were in the right place, but the recycling rate didn't improve. And then we found out why: [[the cleaners were emptying both bins into the same container]]."],
          [0, "So the students were doing it right, and it was all mixed up afterwards."],
          [1, "Exactly. That's the main thing we still need to do: [[interview the cleaners]] and their manager. We've got enough survey data, and the posters can wait."],
          [0, "And who are we presenting to?"],
          [1, "The students' union asked for a copy, but the actual presentation is to the [[accommodation office]], because they control the budget for bins."],
          [0, "Right. Now, our recommendations. Shall we include a deposit scheme, where students get money back for bottles?"],
          [1, "I like it, actually. People will do anything for a bit of money."],
          [0, "[[I'm not convinced]]. The machines are expensive, and most students don't buy many bottles."],
          [1, "OK, we can discuss it with Dr Price. What about colour-coded bins?"],
          [0, "Definitely. [[We both agree]] that's essential. The same colours in every kitchen."],
          [1, "Yes. And a competition between halls?"],
          [0, "I think that would be fun."],
          [1, "[[I'm not so sure]]. Last year's energy competition got very little interest."],
          [0, "Hmm, fair point. What about fines for putting the wrong things in the recycling?"],
          [1, "[[We both think that's a bad idea]]. It would be impossible to know who did it, and it would make people resentful."],
          [0, "Agreed. And your idea of an app that tells you which bin to use?"],
          [1, "I still think it would help."],
          [0, "[[Students have too many apps already]]. I think a simple poster above each bin would work better."],
        ]),
        part(4, "Part 4 · Lecture: colour in marketing", "A lecture on the role of colour in marketing.", ["Lecturer"], [
          [0, "Today I'm going to talk about the role of colour in marketing. Research suggests that when we encounter a product for the first time, our initial impression is strongly influenced by its [[colour]], often before we've read any words on the packaging."],
          [0, "Certain colours have common associations, at least in Western markets. Blue, for example, is often linked with [[trust]] and reliability, which is one reason why it's so popular with banks and technology companies. Red is associated with energy and excitement, and many fast-food chains combine red with [[yellow]], a cheerful colour that's easy to see from a distance."],
          [0, "However, these associations are not universal. In parts of East Asia, white has traditionally been associated with [[mourning]] and is worn at funerals, whereas in many Western countries it's the colour of weddings. And in China, red symbolises good [[luck]] and happiness, so it's widely used in packaging for festivals."],
          [0, "Colour can be so important to a brand that companies try to protect it legally. The French designer Christian Louboutin, for instance, has fought legal cases to protect the red [[soles]] of his shoes as a trademark. Other attempts have been less successful. A British chocolate company spent years trying to register a particular shade of [[purple]] as its own, but eventually lost in court."],
          [0, "So is there a right colour for a brand? Researchers who have studied this argue that no single colour is best. What matters most is the [[fit]] between the colour and the personality of the brand. A luxury brand and a children's toy brand need very different colours."],
          [0, "Finally, designers need to remember that not everyone sees colour in the same way. Around one in [[twelve]] men has some form of colour blindness, most commonly difficulty distinguishing red from green. So important information should never be shown by colour alone. Designers should also use shapes and [[text]]."],
        ]),
      ],
      groups: [
        { title: "Part 1 · Questions 1–6", instr: "Complete the form below. Write <b>ONE WORD AND/OR A NUMBER</b> for each answer.", notes: "TASTE CATERING — Order form", questions: [
          gap(1, "Name: Lena {}", "Fischer", "Spelled F-I-S-C-H-E-R."),
          gap(2, "Type of party: {}", "retirement", "The birthday party was last year."),
          gap(3, "Number of guests: {}", ["45", "forty-five"], "Forty invited, plus extra."),
          gap(4, "Date: Saturday {} May", ["24", "24th", "twenty-fourth"], "“Saturday the twenty-fourth of May.”"),
          gap(5, "Venue: the {} Hall, Station Road", "Church", "The Community Centre was booked."),
          gap(6, "Menu: {} buffet", "Mediterranean", "Asian food is too spicy for many guests."),
        ] },
        { title: "Part 1 · Questions 7–10", instr: "Complete the notes below. Write <b>ONE WORD AND/OR A NUMBER</b> for each answer.", notes: "Order details", questions: [
          gap(7, "Vegetarians: {}", ["12", "twelve"], "Ten was her first estimate."),
          gap(8, "Dessert: chocolate cake and fresh {}", "fruit", "Comes with the Mediterranean menu."),
          gap(9, "Price per person: £{}", ["18.50", "18.5"], "Includes plates, cutlery and staff."),
          gap(10, "Deposit due at least {} days before", ["14", "fourteen"], "Twenty per cent."),
        ] },
        { title: "Part 2 · Questions 11–15", instr: "Choose the correct letter, <b>A, B or C</b>.", questions: [
          mcq(11, "Where will the careers fair be held this year?", ["the sports centre", "the Great Hall", "the library"], "B", "The sports centre was the previous location."),
          mcq(12, "How many employers will attend?", ["forty", "sixty", "eighty"], "B", "Eighty was the target."),
          mcq(13, "Students must bring", ["printed copies of their CV.", "a laptop.", "their student ID card."], "C", "Employers scan QR codes instead of printed CVs."),
          mcq(14, "Talks on the stage will take place", ["every hour.", "in the morning only.", "at lunchtime."], "A", "Starting at ten."),
          mcq(15, "Students who complete the survey can", ["win a prize.", "get a certificate.", "meet employers again."], "A", "A prize draw for a tablet."),
        ] },
        { title: "Part 2 · Questions 16–20", instr: "Label the plan below. Choose the correct letter, <b>A–H</b>.", context: hallPlan(), questions: [
          sel(16, "CV advice {}", "A", "Corner immediately to your left as you enter.", ["A", "B", "C", "D", "E", "F", "G", "H"]),
          sel(17, "Health sector employers {}", "B", "The opposite corner, on your right as you enter.", ["A", "B", "C", "D", "E", "F", "G", "H"]),
          sel(18, "Engineering companies {}", "G", "Far right-hand corner at the top of the plan.", ["A", "B", "C", "D", "E", "F", "G", "H"]),
          sel(19, "Education employers {}", "C", "Left-hand side, beside the café.", ["A", "B", "C", "D", "E", "F", "G", "H"]),
          sel(20, "Volunteering organisations {}", "H", "Directly in front of the stage. D (centre) is technology.", ["A", "B", "C", "D", "E", "F", "G", "H"]),
        ] },
        { title: "Part 3 · Questions 21–25", instr: "Choose the correct letter, <b>A, B or C</b>.", questions: [
          mcq(21, "What was the main finding of the survey?", ["Bins were too far from students' rooms.", "Students were unsure what could be recycled.", "Students did not want to recycle."], "B", "Most want to recycle but don't know the rules."),
          mcq(22, "What caused the biggest problem in the bins?", ["paper", "food packaging", "takeaway containers"], "C", "Paper and food packaging were mostly OK."),
          mcq(23, "Why did the trial in Block C fail?", ["The signs were removed.", "The bins were in the wrong place.", "The cleaners mixed the waste together."], "C", "Both bins were emptied into the same container."),
          mcq(24, "Who will the students present their results to?", ["the students' union", "the accommodation office", "the environment society"], "B", "They control the budget for bins."),
          mcq(25, "What do the students still need to do?", ["interview the cleaners", "collect more survey data", "design posters"], "A", "They have enough data; posters can wait."),
        ] },
        { title: "Part 3 · Questions 26–30", instr: "What is each student's opinion of the following ideas? Choose the correct letter, <b>A–D</b>.", box: box(["Both students support it.", "Only Amira supports it.", "Only Josh supports it.", "Neither student supports it."], "Opinions"), questions: [
          sel(26, "a deposit scheme for bottles {}", "C", "Josh likes it; Amira isn't convinced."),
          sel(27, "colour-coded bins {}", "A", "“We both agree that's essential.”"),
          sel(28, "a competition between halls {}", "B", "Amira thinks it would be fun; Josh isn't sure."),
          sel(29, "fines for incorrect recycling {}", "D", "“We both think that's a bad idea.”"),
          sel(30, "a recycling app {}", "C", "Josh's idea; Amira prefers posters."),
        ] },
        { title: "Part 4 · Questions 31–40", instr: "Complete the notes below. Write <b>ONE WORD AND/OR A NUMBER</b> for each answer.", notes: "COLOUR IN MARKETING", questions: [
          gap(31, "First impressions strongly influenced by {}", ["colour", "color"], "Before reading any words."),
          gap(32, "Blue: linked with {} and reliability", "trust", "Popular with banks."),
          gap(33, "Fast-food chains: red combined with {}", "yellow", "Easy to see from a distance."),
          gap(34, "Parts of East Asia: white associated with {}", "mourning", "Worn at funerals."),
          gap(35, "China: red symbolises good {}", "luck", "Used for festival packaging."),
          gap(36, "Louboutin protected the red {} of his shoes", "soles", "As a trademark."),
          gap(37, "A chocolate company lost a case over a shade of {}", "purple", "Lost in court."),
          gap(38, "What matters most: the {} between colour and brand personality", ["fit", "match"], "No single colour is best."),
          gap(39, "Around one in {} men has some colour blindness", ["12", "twelve"], "Red–green most common."),
          gap(40, "Don't rely on colour alone: also use shapes and {}", "text", "Accessibility."),
        ] },
      ],
    },

    reading: {
      passages: [
        {
          title: "Stairways to the Sky",
          paras: [
            "In the mountains of northern Luzon, in the Philippines, rice terraces climb the steep slopes like giant staircases, some reaching altitudes of more than 1,500 metres. The Ifugao people began building them centuries ago — estimates range from several hundred to two thousand years — using stones and mud to create level fields on land that would otherwise be impossible to farm. In 1995, the rice terraces of the Philippine Cordilleras were added to UNESCO's World Heritage List.",
            "Similar landscapes are found across Asia, from the Hani terraces of Yunnan in southern China to the slopes around Sa Pa in northern Vietnam and the island of Bali in Indonesia. In each case, terraces solve the same basic problem: rice is usually grown in flooded fields, and water naturally runs downhill. By building a series of flat steps, each enclosed by a low wall, farmers can hold water on the slope and pass it gradually from one level to the next.",
            "The success of the system depends on careful management of water. In the Ifugao region, forests at the top of the mountains are protected because they capture rainfall and release it slowly into streams. Channels carry this water to the highest terraces, from which it flows down through the fields. In Bali, a traditional system known as subak, organised through water temples, coordinates the sharing of water between farmers, and is itself recognised as a World Heritage site.",
            "Terraces also protect the soil. On bare slopes, heavy tropical rain would quickly wash soil away; the terrace walls slow the flow of water and trap sediment. Many terraces support more than rice: fish and ducks may be raised in the flooded fields, eating insects and fertilising the soil, while beans and vegetables are grown on the walls.",
            "Despite their beauty and ingenuity, many terraces are under threat. Farming them is hard physical work, and incomes are low. Many young people have moved to cities in search of better-paid jobs, leaving too few workers to maintain the walls and channels. Once a terrace is abandoned, its walls can collapse within a few years, and the damage spreads to the terraces below. In 2001, the Ifugao terraces were placed on UNESCO's list of World Heritage in Danger, although they were removed from that list in 2012 after conservation efforts.",
            "Tourism has brought both opportunities and problems. Visitors provide income, and some farmers now earn money from homestays and guiding. But tourism can also draw labour away from farming, and the construction of hotels and roads can disrupt water channels. The challenge, local organisations say, is to ensure that the terraces remain living farms rather than becoming merely scenery.",
          ],
          groups: [
            { title: "Questions 1–6", instr: "Do the following statements agree with the information given in Reading Passage 1? Choose <b>TRUE</b>, <b>FALSE</b> or <b>NOT GIVEN</b>.", questions: [
              tf(1, "Some of the Ifugao terraces are higher than 1,500 metres.", "TRUE", "Paragraph 1."),
              tf(2, "Experts agree on exactly when the Ifugao terraces were built.", "FALSE", "“Estimates range from several hundred to two thousand years.”"),
              tf(3, "Terraces make it possible to hold water on sloping land.", "TRUE", "Paragraph 2."),
              tf(4, "The Hani terraces are older than the Ifugao terraces.", "NOT GIVEN", "Their ages are not compared."),
              tf(5, "Fish raised in the terraces help to fertilise the soil.", "TRUE", "Paragraph 4."),
              tf(6, "The Ifugao terraces are still on the list of World Heritage in Danger.", "FALSE", "They were removed in 2012."),
            ] },
            { title: "Questions 7–10", instr: "Complete the notes below. Choose <b>ONE WORD ONLY</b> from the passage for each answer.", notes: "How terraces work", questions: [
              gap(7, "Forests at the top capture {}", "rainfall", "Paragraph 3."),
              gap(8, "Terrace walls slow water and trap {}", "sediment", "Paragraph 4."),
              gap(9, "Beans and vegetables are grown on the {}", "walls", "Paragraph 4."),
              gap(10, "Abandoned terraces: walls may {} within a few years", "collapse", "Paragraph 5."),
            ] },
            { title: "Questions 11–13", instr: "Choose the correct letter, <b>A, B, C or D</b>.", questions: [
              mcq(11, "What basic problem do terraces solve?", ["keeping water on slopes", "protecting crops from animals", "shortening the growing season", "providing space for housing"], "A", "Paragraph 2."),
              mcq(12, "Why are many terraces being abandoned?", ["climate change", "young people moving to cities", "restrictions on tourism", "government policy"], "B", "Paragraph 5."),
              mcq(13, "Local organisations want the terraces to", ["become national parks.", "remain working farms.", "be closed to tourists.", "be rebuilt with concrete."], "B", "“Living farms rather than… merely scenery.”"),
            ] },
          ],
        },
        {
          title: "The Promise and Problems of Bioplastics",
          lettered: true,
          paras: [
            "Plastic is one of the defining materials of modern life, and also one of its most persistent environmental problems. Conventional plastics are made from oil and gas, and most can take hundreds of years to break down. Bioplastics have been promoted as a solution, but the term covers a confusing variety of materials, and not all of them are as green as their name suggests.",
            "The first source of confusion is that 'bioplastic' can mean two quite different things. Some bioplastics are bio-based: they are made wholly or partly from plants, such as maize, sugar cane or cassava, rather than from fossil fuels. Others are biodegradable: they can be broken down by microorganisms into water, carbon dioxide and natural materials. A plastic can be one without being the other. Polyethylene made from sugar cane, for example, is chemically identical to the conventional version and is not biodegradable at all, while some biodegradable plastics are made from fossil fuels.",
            "Even biodegradable plastics are less straightforward than they appear. One of the most common, polylactic acid (PLA), made from plant sugars, breaks down efficiently only in industrial composting facilities, where temperatures are kept high for weeks. In a garden compost heap, or in the ocean, it may persist for years. Many places have no industrial composting facilities at all, so PLA cups and packaging often end up in landfill or incinerators.",
            "Some newer materials perform better. A family of plastics known as PHAs is produced by bacteria, which store the material inside their cells as an energy reserve. PHAs can biodegrade in soil and even in seawater, making them potentially valuable for items that are likely to escape into the environment, such as fishing gear. At present, however, they are considerably more expensive to produce than conventional plastics.",
            "There are also concerns about the land needed to grow raw materials. Critics argue that using farmland to produce plastics could compete with food production and encourage deforestation. Supporters respond that the amount of land currently used is very small, and that agricultural waste, such as husks and stalks, could increasingly be used instead of food crops.",
            "Perhaps the greatest practical problem is confusion among consumers and waste managers. Biodegradable plastics look much like conventional ones, and when they are put into recycling bins they can contaminate the recycling process. Labels such as 'eco-friendly' or 'plant-based' are often vague. Many experts conclude that bioplastics are useful for specific purposes, but that the most effective way to reduce plastic pollution remains using less plastic in the first place.",
          ],
          groups: [
            { title: "Questions 14–18", instr: "Reading Passage 2 has six paragraphs, <b>A–F</b>. Which paragraph contains the following information?", questions: [
              sel(14, "an example of a plant-based plastic that does not biodegrade {}", "B", "Sugar-cane polyethylene.", ["A", "B", "C", "D", "E", "F"]),
              sel(15, "a description of a plastic produced by living organisms {}", "D", "PHAs are produced by bacteria.", ["A", "B", "C", "D", "E", "F"]),
              sel(16, "a suggestion that waste materials could replace food crops {}", "E", "Husks and stalks.", ["A", "B", "C", "D", "E", "F"]),
              sel(17, "a reason why some biodegradable plastic ends up in landfill {}", "C", "No industrial composting facilities.", ["A", "B", "C", "D", "E", "F"]),
              sel(18, "a warning about vague descriptions on products {}", "F", "‘Eco-friendly’ or ‘plant-based’ labels.", ["A", "B", "C", "D", "E", "F"]),
            ] },
            { title: "Questions 19–22", instr: "Classify the following statements as referring to <b>A</b> PLA, <b>B</b> PHAs or <b>C</b> sugar-cane polyethylene.", box: box(["PLA", "PHAs", "sugar-cane polyethylene"], "Materials"), questions: [
              sel(19, "It is chemically identical to a conventional plastic. {}", "C", "Paragraph B."),
              sel(20, "It needs high temperatures to break down efficiently. {}", "A", "Industrial composting."),
              sel(21, "It can break down in seawater. {}", "B", "Paragraph D."),
              sel(22, "It is currently much more expensive than conventional plastic. {}", "B", "Paragraph D."),
            ] },
            { title: "Questions 23–26", instr: "Complete the sentences below. Choose <b>NO MORE THAN TWO WORDS</b> from the passage for each answer.", questions: [
              gap(23, "Biodegradable plastics are broken down by {}.", "microorganisms", "Paragraph B."),
              gap(24, "Bio-based plastics may be made from maize, sugar cane or {}.", "cassava", "Paragraph B."),
              gap(25, "PHAs could be useful for items such as {}, which often escape into the environment.", "fishing gear", "Paragraph D."),
              gap(26, "Biodegradable plastics put in recycling bins can {} the recycling process.", "contaminate", "Paragraph F."),
            ] },
          ],
        },
        {
          title: "Who Should the Car Save?",
          paras: [
            "Imagine a self-driving car whose brakes have failed. Ahead are five pedestrians; if the car swerves, it will kill one person on the pavement instead. What should it be programmed to do? This scenario, a version of the philosopher's 'trolley problem', has dominated public discussion of the ethics of autonomous vehicles.",
            "In 2016, researchers launched an online experiment called the Moral Machine, inviting people around the world to decide how cars should behave in such dilemmas. By the time the results were published in 2018, it had collected around 40 million decisions from people in more than 200 countries and territories. Some preferences were nearly universal: participants generally chose to spare humans over animals, more lives over fewer, and young people over old. But there were also notable cultural differences; the preference for sparing the young, for example, was weaker in some East Asian countries.",
            "The experiment was an impressive piece of research, and it revealed fascinating differences in moral intuition. Yet I believe the attention paid to such dilemmas has been largely misplaced. Situations in which a car must choose between killing one group of people and another are, by all accounts, extremely rare. A car that is driving at an appropriate speed and monitoring its surroundings will almost always be able to brake. The more relevant question is how to make such situations less likely in the first place.",
            "That question raises ethical issues that are less dramatic but far more pressing. How safe must an autonomous vehicle be before it is allowed on public roads — as safe as the average human driver, or much safer? Human drivers cause a huge number of deaths every year, so a technology that reduced them even modestly could save many lives. But the public may be less tolerant of deaths caused by machines than of those caused by people, and a single high-profile accident can damage trust in the entire technology.",
            "There are also questions of responsibility. When a human driver causes an accident, the law has well-established ways of assigning blame. When an autonomous system fails, it is less clear whether responsibility lies with the manufacturer, the software developer, the owner or the person sitting in the driver's seat. Many vehicles currently on sale offer partial automation, in which the system controls the car but expects the human to take over at any moment — an arrangement that research suggests people find difficult, since attention tends to wander when they are not actively driving.",
            "Finally, the wider social effects deserve attention. Millions of people earn their living by driving taxis, buses and lorries. Autonomous vehicles also generate vast amounts of data about where people travel, raising questions of privacy. These issues will affect far more people than any trolley problem.",
            "None of this means that philosophers should stop discussing dilemmas. Thought experiments can clarify our values. But if we want autonomous vehicles to be introduced in a way that is safe and fair, we need to spend less time debating whom the car should hit, and more time on the ordinary decisions that will shape how these vehicles are designed, regulated and used.",
          ],
          groups: [
            { title: "Questions 27–30", instr: "Choose the correct letter, <b>A, B, C or D</b>.", questions: [
              mcq(27, "The Moral Machine experiment", ["was carried out only in the United States.", "collected decisions from people in many countries.", "found no cultural differences.", "was designed by car manufacturers."], "B", "More than 200 countries and territories."),
              mcq(28, "Which preference was nearly universal?", ["sparing animals rather than humans", "sparing fewer lives rather than more", "sparing humans rather than animals", "sparing older people rather than younger"], "C", "Paragraph 2."),
              mcq(29, "Why does the writer think the focus on dilemmas is misplaced?", ["Such situations are extremely rare.", "The experiment was badly designed.", "Philosophers cannot agree.", "Cars cannot detect pedestrians."], "A", "Paragraph 3."),
              mcq(30, "What problem with partial automation does the writer mention?", ["It is too expensive.", "People find it hard to stay attentive.", "It is illegal in many countries.", "It produces too much data."], "B", "Attention wanders when not actively driving."),
            ] },
            { title: "Questions 31–35", instr: "Do the following statements agree with the claims of the writer in Reading Passage 3? Choose <b>YES</b>, <b>NO</b> or <b>NOT GIVEN</b>.", questions: [
              yn(31, "The Moral Machine was an impressive piece of research.", "YES", "Paragraph 3."),
              yn(32, "A car driving at an appropriate speed will almost always be able to stop.", "YES", "Paragraph 3."),
              yn(33, "Autonomous vehicles should be allowed only when they are perfectly safe.", "NOT GIVEN", "The writer raises the question but gives no answer."),
              yn(34, "The public will be equally tolerant of accidents caused by machines and by people.", "NO", "“May be less tolerant of deaths caused by machines.”"),
              yn(35, "Philosophers should stop discussing moral dilemmas.", "NO", "“None of this means that philosophers should stop.”"),
            ] },
            { title: "Questions 36–40", instr: "Complete the summary using the list of words, <b>A–H</b>, below.", context: `<div class="qbox" style="font-family:var(--serif);font-size:1rem;line-height:1.8">The writer argues that more attention should be paid to how safe vehicles must be before they are <b>(36)</b> ______ for public roads, and to who is <b>(37)</b> ______ when automated systems fail. Partially automated cars expect drivers to <b>(38)</b> ______ at any moment. Wider issues include the effect on people who drive for a <b>(39)</b> ______, and the <b>(40)</b> ______ of travel data.</div>`, box: box(["approved", "responsible", "take over", "living", "privacy", "tested", "cost", "blamed"]), questions: [
              sel(36, "Gap 36 {}", "A", "“Allowed on public roads.”"),
              sel(37, "Gap 37 {}", "B", "Responsibility, paragraph 5."),
              sel(38, "Gap 38 {}", "C", "Paragraph 5."),
              sel(39, "Gap 39 {}", "D", "“Earn their living by driving.”"),
              sel(40, "Gap 40 {}", "E", "Paragraph 6."),
            ] },
          ],
        },
      ],
    },

    writing: {
      task1: {
        prompt: "The chart below shows the percentage of household waste that was recycled in four towns in 2015 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        chart: { type: "bar", title: "Household waste recycled (%)", x: ["Anford", "Belton", "Caxby", "Dunmore"], series: [["2015", [22, 35, 18, 40]], ["2025", [48, 41, 52, 38]]], max: 60, step: 10 },
        plan: [
          "Overview: recycling rose in three of the four towns, most dramatically in Caxby and Anford; Dunmore was the only town where the rate fell, moving from the highest in 2015 to the lowest in 2025.",
          "Body 1: Caxby almost tripled (18% → 52%), becoming the highest; Anford more than doubled (22% → 48%).",
          "Body 2: Belton rose modestly (35% → 41%); Dunmore dipped slightly (40% → 38%).",
          "Highlight the reversal of rankings — a key feature.",
        ],
      },
      task2: {
        prompt: "Some people think that the best way to reduce traffic in city centres is to charge drivers a fee to enter them. To what extent do you agree or disagree? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        plan: [
          "Position (e.g. agree, but only with good public transport).",
          "Body 1: charges reduce car use quickly, raise money for public transport, cut pollution (congestion charging in some major cities).",
          "Body 2 (concession + rebuttal): unfair to low-income drivers and businesses; solution — exemptions, reinvest revenue, improve buses/metro first.",
          "Conclusion: restate position with condition.",
        ],
      },
    },

    speaking: {
      part1: [
        { topic: "Colours", qs: ["What is your favourite colour?", "Are there any colours you don't like?", "Do colours affect your mood?", "Are certain colours important in your culture?"] },
        { topic: "Sleep", qs: ["How many hours do you usually sleep?", "Do you ever take naps during the day?", "What do you do if you can't sleep?", "Has your sleep changed since you were a child?"] },
      ],
      part2: { card: "Describe a website or app that you use often.", bullets: ["what it is", "how you found out about it", "what you use it for"], end: "and explain why you find it useful.", theme: "technology and information" },
      part3: ["How do people in your country usually find information today?", "Is information on the internet reliable?", "Should children's use of apps be limited?", "How might technology change the way people work in the future?"],
    },
  };
})();
