/* Practice Test 6 — original IELTS-style material. */
(function () {
  const { gap, mcq, multi, tf, yn, sel, box, roman, part } = window.TB;

  /* Plan for Part 2, questions 15–20 (north at the top; the tour walks east along Main Street). */
  function oldTownMap() {
    const pin = (l, x, y) => `<g class="map-pin"><circle cx="${x}" cy="${y}" r="13"/><text x="${x}" y="${y + 4.5}" text-anchor="middle">${l}</text></g>`;
    return `<div class="map-wrap"><svg viewBox="0 0 600 360" role="img" aria-label="Plan of the old town with places labelled A to H">
      <rect class="map-grass" x="20" y="20" width="560" height="320" rx="14"/>
      <rect class="map-water" x="20" y="34" width="560" height="30"/>
      <text class="map-label" x="560" y="54" text-anchor="end">River</text>
      <rect class="map-feature" x="288" y="28" width="24" height="42" rx="3"/>
      <text class="map-label" x="318" y="26" style="font-size:10px">Bridge</text>
      <path class="map-path" d="M40,230 L560,230"/>
      <path class="map-path" d="M150,230 L150,80"/>
      <path class="map-path" d="M300,230 L300,72"/>
      <path class="map-path" d="M450,230 L450,80"/>
      <text class="map-label" x="560" y="252" text-anchor="end">Main Street</text>
      <text class="map-label" transform="translate(140 175) rotate(-90)" text-anchor="middle">Castle Road</text>
      <text class="map-label" transform="translate(290 175) rotate(-90)" text-anchor="middle">Bridge Street</text>
      <text class="map-label" transform="translate(440 175) rotate(-90)" text-anchor="middle">Market Street</text>
      <text class="map-label" x="42" y="270" style="font-weight:800">★ Tourist office (start)</text>
      <g transform="translate(555 105)"><path d="M0,-16 L6,6 L0,1 L-6,6 Z" fill="var(--text)"/><text class="map-label" x="0" y="20" text-anchor="middle">N</text></g>
      ${pin("A", 100, 192)}${pin("B", 220, 192)}${pin("C", 150, 92)}${pin("D", 378, 150)}
      ${pin("E", 300, 92)}${pin("F", 515, 192)}${pin("G", 450, 285)}${pin("H", 225, 285)}
    </svg></div>`;
  }

  window.IELTS_TESTS[6] = {
    listening: {
      parts: [
        part(1, "Part 1 · Booking a summer camp", "A father phones to book a place on a children's summer camp.", ["Rachel (camp office)", "Peter (parent)"], [
          [0, "Sunshine Adventure Camp, Rachel speaking."],
          [1, "Hello. I'd like to book a place for my daughter on one of your summer camps."],
          [0, "Lovely. What's your daughter's name?"],
          [1, "Emily Novak. That's [[N, O, V, A, K]]."],
          [0, "And how old is Emily?"],
          [1, "She's [[nine]]. She'll be ten in September, but she's nine now."],
          [0, "We go by age on the first day of camp, so she'll be in the eight-to-ten group. Which week would you like?"],
          [1, "We were hoping for the week beginning the fourteenth of July."],
          [0, "I'm sorry, that week is full. We still have places in the week beginning the [[twenty-first]]."],
          [1, "OK, the twenty-first, then."],
          [0, "Each child chooses a main activity for the week. The options are swimming, climbing, drama or cooking."],
          [1, "She already has swimming lessons at school, so she'd like to try [[climbing]]."],
          [0, "Great choice. Does she have any medical conditions or allergies we should know about?"],
          [1, "Yes, she's allergic to [[nuts]]. It's quite serious."],
          [0, "Thank you. We have a nut-free policy, but I'll make a note for the kitchen. And who should we contact in an emergency if we can't reach you?"],
          [1, "Her [[grandmother]]. She lives very close to the camp."],
          [0, "Perfect. Now some practical details. The camp starts at [[eight forty-five]] each morning and finishes at four. Parents can drop children off from eight thirty."],
          [1, "What does she need to bring?"],
          [0, "A packed lunch, a water bottle, and a [[hat]], because many activities are outdoors. We provide all the climbing equipment."],
          [1, "And how much is it?"],
          [0, "It's [[one hundred and seventy-five]] pounds for the week. There's a discount for brothers and sisters, but that doesn't apply here."],
          [1, "Is there any discount for booking early?"],
          [0, "Yes. If you book online before the end of May, use the code [[S, U, N, 1, 0]] and you'll get ten per cent off."],
          [1, "Brilliant. Thank you."],
        ]),
        part(2, "Part 2 · An old-town walking tour", "A guide begins a walking tour of an old town.", ["Elena (guide)"], [
          [0, "Good morning, everyone, and welcome to the Old Town walking tour. My name's Elena. The tour takes about [[an hour and a half]], and we'll finish back here at the tourist office, at the western end of Main Street."],
          [0, "Before we set off, a little history. Because the town is on a river, many people assume it grew rich from fishing. In fact, its wealth came mainly from the [[wool trade]]. In the fifteenth century, merchants exported wool all over Europe, and you'll see their fine houses as we walk."],
          [0, "One piece of advice: please [[wear comfortable shoes]]. Most of the streets are cobbled and can be slippery. And the price of your ticket includes [[a drink at the Riverside Café]] at the end of the tour, so do hold on to your ticket."],
          [0, "Right, let's look at the plan. We'll walk east along Main Street. The first building on your left, just before Castle Road, is the [[Old Bakery]], which has been making bread on the same site for over three hundred years."],
          [0, "Just after you cross Castle Road, look across to the right-hand side of the street. That large stone building is the [[Town Hall]]. The souvenir shop opposite it isn't part of the tour, I'm afraid."],
          [0, "Next, we'll turn left into Bridge Street and walk towards the river. The [[Clock Tower]] stands at the end of the street, right next to the bridge. Its clock still strikes every hour."],
          [0, "Then we'll come back down Bridge Street. On your left, in the block between Bridge Street and Market Street, set back from the main road, is the [[Art Gallery]], in what was once a wool merchant's house."],
          [0, "Back on Main Street, we'll continue east as far as Market Street. The [[Fish Market]] is on the corner, on the south side of Main Street. The hotel at the far eastern end of Main Street is very nice, but we won't be stopping there."],
          [0, "And finally, for the best view of the town, we'll walk up Castle Road to the castle ruins at the top, beside the river. That's our [[viewpoint]], and it's where I'll take a group photo."],
        ]),
        part(3, "Part 3 · A dissertation on tourism", "A student, Lucy, discusses her dissertation with her tutor, Professor Hart.", ["Professor Hart (tutor)", "Lucy (student)"], [
          [0, "So, Lucy, how's the dissertation going?"],
          [1, "Quite well, I think. I've finished collecting my data."],
          [0, "Remind me why you chose Kalaya Island."],
          [1, "Well, I'd read that very few studies had been done there, which was useful. But the main reason is that [[I worked at a guesthouse there]] for a summer, so I already knew a lot of people."],
          [0, "That must have helped. What was your main method?"],
          [1, "I started with questionnaires, but the [[language barrier]] was a real problem. Many older residents don't read English, and translating everything was going to take too long. So in the end I relied mainly on [[interviews]], with a local student acting as an interpreter."],
          [0, "How many interviews did you do?"],
          [1, "Thirty-two."],
          [0, "That's a good number. My concern is who you interviewed. Looking at your list, [[most of them own businesses connected to tourism]], guesthouses and restaurants. They're bound to be positive about tourism. You'll need to address that."],
          [1, "That's true. I'll discuss it as a limitation. The interesting thing was that even people who don't earn money from tourism [[were mostly positive about the tourists themselves]]. I expected much more resentment."],
          [0, "That's an important finding. So what will you do next?"],
          [1, "I was going to start analysing the interviews."],
          [0, "I'd actually suggest you [[revise your literature review first]]. Some of your sources are quite old, and there's been a lot of recent research on island tourism. Then your analysis will be easier to position."],
          [1, "OK. Can I quickly check my summary of the impacts?"],
          [0, "Go ahead."],
          [1, "On the positive side, tourism has created new [[jobs]] for young people, so fewer of them leave the island. And the government has improved the [[roads]], which helps everyone."],
          [0, "And the negative side?"],
          [1, "The biggest problem is a shortage of fresh [[water]] in the dry season, because the hotels use so much. And the cost of [[land]] has risen so much that local families can't afford to buy it."],
          [0, "Good. That's a clear summary."],
        ]),
        part(4, "Part 4 · Lecture: how animals navigate", "A lecture on animal navigation.", ["Lecturer"], [
          [0, "Today we're looking at one of the great puzzles of biology: how animals find their way over enormous distances."],
          [0, "The record holder is the Arctic tern, a small seabird that breeds in the Arctic and spends the northern winter near Antarctica. Tracking studies suggest that some individuals travel around [[seventy thousand]] kilometres in a single year."],
          [0, "So how do they navigate? Birds use several cues. During the day, many species use the position of the [[sun]], adjusting for the time of day with their internal clock. Birds that migrate at night use the stars. In famous experiments in the 1960s, young birds were raised in a [[planetarium]], where the pattern of stars on the ceiling could be changed. When the star pattern was rotated, the birds changed the direction in which they tried to fly."],
          [0, "Many animals can also detect the Earth's [[magnetic]] field. Sea turtles are a remarkable example. Female turtles return, sometimes after decades at sea, to lay their eggs on the same [[beach]] where they themselves hatched. It seems they remember the particular magnetic signature of that coastline."],
          [0, "Salmon use a different sense. After years in the ocean, they find their way back to the river where they were born using their sense of [[smell]], recognising the particular chemicals of their home stream."],
          [0, "Homing pigeons probably combine several methods. Interestingly, studies using GPS trackers found that pigeons flying over familiar areas often follow [[landmarks]] such as roads and railway lines, rather than flying in a straight line."],
          [0, "Insects navigate too. Monarch butterflies in North America fly thousands of kilometres to spend the winter in the mountains of [[Mexico]]. They use the sun as a compass, and part of the clock that allows them to correct for the sun's movement appears to be located in their [[antennae]]."],
          [0, "Finally, human activity can interfere with these systems. Young sea turtles, for example, find the sea by moving towards the brightest horizon. Artificial [[lights]] on beaches can lead them inland instead, which is why many coastal towns now restrict lighting during the nesting season."],
        ]),
      ],
      groups: [
        { title: "Part 1 · Questions 1–6", instr: "Complete the form below. Write <b>ONE WORD AND/OR A NUMBER</b> for each answer.", notes: "SUNSHINE ADVENTURE CAMP — Booking form", questions: [
          gap(1, "Child's name: Emily {}", "Novak", "Spelled N-O-V-A-K."),
          gap(2, "Age: {}", ["9", "nine"], "She'll be ten in September but is nine now."),
          gap(3, "Week beginning: {} July", ["21", "21st", "twenty-first"], "The 14th is full."),
          gap(4, "Main activity: {}", "climbing", "She already does swimming at school."),
          gap(5, "Allergy: {}", "nuts", "“She's allergic to nuts.”"),
          gap(6, "Emergency contact: her {}", ["grandmother", "grandma", "granny"], "She lives close to the camp."),
        ] },
        { title: "Part 1 · Questions 7–10", instr: "Complete the notes below. Write <b>ONE WORD AND/OR A NUMBER</b> for each answer.", notes: "Camp information", questions: [
          gap(7, "Camp starts at {} am", ["8.45", "8:45", "eight forty-five", "quarter to nine"], "Drop-off from 8.30 is a distractor."),
          gap(8, "Bring: packed lunch, water bottle and a {}", "hat", "Many activities are outdoors."),
          gap(9, "Cost: £{} per week", "175", "The sibling discount does not apply."),
          gap(10, "Early-booking code: {}", "SUN10", "Dictated letter by letter."),
        ] },
        { title: "Part 2 · Questions 11–14", instr: "Choose the correct letter, <b>A, B or C</b>.", questions: [
          mcq(11, "How long does the tour last?", ["one hour", "an hour and a half", "two hours"], "B", "“About an hour and a half.”"),
          mcq(12, "The town became rich mainly through", ["fishing.", "the wool trade.", "shipbuilding."], "B", "People assume fishing, but it was wool."),
          mcq(13, "The guide advises visitors to", ["wear comfortable shoes.", "bring an umbrella.", "carry water."], "A", "The streets are cobbled and slippery."),
          mcq(14, "The ticket price includes", ["entry to the castle.", "a drink at a café.", "a guidebook."], "B", "“A drink at the Riverside Café.”"),
        ] },
        { title: "Part 2 · Questions 15–20", instr: "Label the plan below. Choose the correct letter, <b>A–H</b>.", context: oldTownMap(), questions: [
          sel(15, "Old Bakery {}", "A", "First building on the left (north side) before Castle Road.", ["A", "B", "C", "D", "E", "F", "G", "H"]),
          sel(16, "Town Hall {}", "H", "After Castle Road, on the right-hand (south) side. B is the souvenir shop.", ["A", "B", "C", "D", "E", "F", "G", "H"]),
          sel(17, "Clock Tower {}", "E", "At the end of Bridge Street, next to the bridge.", ["A", "B", "C", "D", "E", "F", "G", "H"]),
          sel(18, "Art Gallery {}", "D", "Walking south down Bridge Street, on the left (east), between Bridge St and Market St.", ["A", "B", "C", "D", "E", "F", "G", "H"]),
          sel(19, "Fish Market {}", "G", "Corner of Market Street, south side of Main Street. F is the hotel.", ["A", "B", "C", "D", "E", "F", "G", "H"]),
          sel(20, "Viewpoint {}", "C", "Castle ruins at the top of Castle Road, by the river.", ["A", "B", "C", "D", "E", "F", "G", "H"]),
        ] },
        { title: "Part 3 · Questions 21–26", instr: "Choose the correct letter, <b>A, B or C</b>.", questions: [
          mcq(21, "Why did Lucy choose Kalaya Island?", ["She had worked there.", "She has family there.", "Few studies had been done there."], "A", "“The main reason is that I worked at a guesthouse there.”"),
          mcq(22, "What was Lucy's main research method?", ["questionnaires", "interviews", "observation"], "B", "She switched from questionnaires to interviews."),
          mcq(23, "What problem did Lucy have with questionnaires?", ["Few people returned them.", "Many residents could not read the language.", "They took too long to complete."], "B", "“The language barrier was a real problem.”"),
          mcq(24, "Professor Hart is concerned that", ["Lucy interviewed too few people.", "most interviewees had an interest in tourism.", "the topic is too broad."], "B", "Most own tourism-related businesses."),
          mcq(25, "What surprised Lucy most?", ["Residents were mostly positive about tourists.", "Young people were leaving the island.", "Prices had risen sharply."], "A", "She expected resentment."),
          mcq(26, "What does Professor Hart advise Lucy to do next?", ["start analysing the interviews", "update her literature review", "return to the island"], "B", "“Revise your literature review first.”"),
        ] },
        { title: "Part 3 · Questions 27–30", instr: "Complete the notes below. Write <b>ONE WORD ONLY</b> for each answer.", notes: "Impacts of tourism on Kalaya Island", questions: [
          gap(27, "Positive: new {} for young people", "jobs", "So fewer leave the island."),
          gap(28, "Positive: improved {}", "roads", "Built by the government."),
          gap(29, "Negative: shortage of fresh {} in the dry season", "water", "Hotels use so much."),
          gap(30, "Negative: rising cost of {}", "land", "Local families can't afford it."),
        ] },
        { title: "Part 4 · Questions 31–40", instr: "Complete the notes below. Write <b>ONE WORD AND/OR A NUMBER</b> for each answer.", notes: "ANIMAL NAVIGATION", questions: [
          gap(31, "Arctic tern: around {} km in a year", ["70000", "70,000", "seventy thousand"], "Tracking studies."),
          gap(32, "Day-flying birds use the position of the {}", "sun", "Adjusted with an internal clock."),
          gap(33, "Experiments in a {} showed birds use star patterns", "planetarium", "Rotating the stars changed their direction."),
          gap(34, "Many animals detect the Earth's {} field", "magnetic", "Magnetic field."),
          gap(35, "Sea turtles lay eggs on the {} where they hatched", "beach", "Remembering its magnetic signature."),
          gap(36, "Salmon find their home river using their sense of {}", "smell", "Chemicals of the home stream."),
          gap(37, "Pigeons over familiar areas follow {} such as roads", "landmarks", "Not straight lines."),
          gap(38, "Monarch butterflies spend the winter in {}", "Mexico", "In the mountains."),
          gap(39, "Part of their internal clock is in their {}", ["antennae", "antennas"], "Allows correction for the sun's movement."),
          gap(40, "Artificial {} lead young turtles inland", ["lights", "light", "lighting"], "So towns restrict lighting."),
        ] },
      ],
    },

    reading: {
      passages: [
        {
          title: "Turning Seawater into Drinking Water",
          paras: [
            "Around 97 per cent of the water on Earth is in the oceans, too salty to drink or to use for irrigation. Of the small fraction that is fresh, most is locked in ice caps and glaciers or lies deep underground. As populations grow and droughts become more frequent, many countries are looking to the sea for a solution: desalination, the removal of salt from seawater.",
            "The idea is ancient — sailors have long known that boiling seawater and collecting the steam produces fresh water — but large-scale desalination is relatively recent. Early plants, built mainly in the oil-rich countries of the Middle East, used thermal methods, heating seawater and condensing the vapour. These plants were reliable but consumed enormous amounts of energy, which made sense only where fuel was cheap.",
            "Today, most new plants use a technique called reverse osmosis. Seawater is pumped at high pressure through membranes with pores so small that water molecules can pass through but salt cannot. Improvements in membranes, and in devices that recover energy from the high-pressure waste stream, have cut the energy required dramatically, and with it the cost of the water produced.",
            "Some countries now depend heavily on desalination. Israel, which suffered repeated droughts, built a series of large plants along its Mediterranean coast and now obtains the majority of its household water from the sea. Singapore, Australia and Spain have also invested heavily, often treating desalination as an insurance policy against drought rather than as their main source of supply.",
            "Desalination is not without problems. For every litre of fresh water produced, plants generate a similar or greater quantity of brine — water with roughly twice the salt concentration of seawater, often containing chemicals used to clean the membranes. When this brine is discharged back into the sea, it sinks and can harm marine life on the seabed unless it is carefully diluted. Intake pipes can also trap fish and plankton.",
            "Energy remains the other major concern. Even with modern technology, desalination uses far more energy than treating river or ground water. If that energy comes from fossil fuels, desalination contributes to the climate change that is making droughts worse. For this reason, newer plants are increasingly powered by solar or wind energy.",
            "Experts generally agree that desalination should be part of a broader strategy rather than a cure-all. Reducing leaks in water networks, recycling wastewater and using water more efficiently in agriculture are usually far cheaper ways of increasing supply. But for coastal cities in dry regions, the sea is likely to become an ever more important source of drinking water.",
          ],
          groups: [
            { title: "Questions 1–6", instr: "Do the following statements agree with the information given in Reading Passage 1? Choose <b>TRUE</b>, <b>FALSE</b> or <b>NOT GIVEN</b>.", questions: [
              tf(1, "Most of the Earth's fresh water is frozen or underground.", "TRUE", "“Locked in ice caps and glaciers or lies deep underground.”"),
              tf(2, "The first large thermal desalination plants were mainly built in Europe.", "FALSE", "Mainly in the Middle East."),
              tf(3, "Technological improvements have reduced the cost of reverse osmosis.", "TRUE", "Paragraph 3."),
              tf(4, "Israel gets most of its household water from desalination.", "TRUE", "“The majority of its household water.”"),
              tf(5, "Spain produces more desalinated water than Australia.", "NOT GIVEN", "No comparison."),
              tf(6, "Brine is less salty than seawater.", "FALSE", "Roughly twice the salt concentration."),
            ] },
            { title: "Questions 7–10", instr: "Complete the notes below. Choose <b>ONE WORD ONLY</b> from the passage for each answer.", notes: "Environmental problems", questions: [
              gap(7, "Brine may contain {} used to clean membranes", "chemicals", "Paragraph 5."),
              gap(8, "Brine sinks and can harm life on the {}", "seabed", "Paragraph 5."),
              gap(9, "{} pipes can trap fish and plankton", "intake", "Paragraph 5."),
              gap(10, "Newer plants use solar or {} energy", "wind", "Paragraph 6."),
            ] },
            { title: "Questions 11–13", instr: "Choose the correct letter, <b>A, B, C or D</b>.", questions: [
              mcq(11, "Why were early desalination plants built in the Middle East?", ["Fuel there was cheap.", "The seawater there was saltier.", "The technology was invented there.", "Few people lived there."], "A", "“Made sense only where fuel was cheap.”"),
              mcq(12, "According to paragraph 4, several countries see desalination as", ["their main source of water.", "protection against drought.", "too expensive to develop.", "unpopular with the public."], "B", "“An insurance policy against drought.”"),
              mcq(13, "What is the writer's conclusion?", ["Desalination should replace other sources.", "Desalination is one part of a wider strategy.", "Desalination should be stopped.", "Desalination only suits Israel."], "B", "“Part of a broader strategy rather than a cure-all.”"),
            ] },
          ],
        },
        {
          title: "Clever Crows",
          lettered: true,
          paras: [
            "The expression 'bird brain' has long been used as an insult, but research on crows and their relatives — ravens, rooks, jays and magpies, collectively known as corvids — has forced scientists to reconsider. In a range of tests, corvids have shown abilities once thought to be unique to humans and great apes.",
            "The most famous examples come from New Caledonia, a group of islands in the Pacific, where crows make and use tools in the wild. They strip and shape twigs into hooks to pull insects out of holes in trees, and cut leaves into barbed tools. In a well-known laboratory study in 2002, a New Caledonian crow called Betty bent a straight piece of wire into a hook to lift a small bucket of food out of a tube, apparently without having been taught to do so.",
            "Other experiments have been inspired by one of Aesop's fables, in which a thirsty crow drops stones into a jug to raise the water level. When presented with a tube of water containing a floating treat just out of reach, several corvid species dropped stones into the tube until the treat rose high enough to grab. They also learned to prefer heavy objects that sank to light objects that floated, and to choose tubes containing water rather than sand.",
            "Corvids also have remarkable social intelligence. In a long-running study in the United States, researchers wearing a particular mask trapped and released a number of wild crows. For years afterwards, crows in the area scolded and mobbed anyone wearing that mask — including birds that had never been trapped themselves, suggesting that they had learned from others which humans to avoid.",
            "Perhaps most surprising is evidence that some corvids can plan for the future. In one study, ravens learned to use a tool to open a box containing food. When later offered a choice of objects, they selected the tool and kept it, even though the box would not be available for another fifteen minutes or, in some trials, until the next day. Such behaviour suggests an ability to anticipate future needs.",
            "How can such small brains achieve so much? Part of the answer appears to lie in their structure. Bird brains are packed with neurons far more densely than mammal brains of similar size, so a crow's brain may contain as many neurons as the brains of some much larger monkeys. Brain size, in other words, may be a poor guide to intelligence, and the insult 'bird brain' may be due for retirement.",
          ],
          groups: [
            { title: "Questions 14–18", instr: "Reading Passage 2 has six paragraphs, <b>A–F</b>. Which paragraph contains the following information?", questions: [
              sel(14, "a test in which birds chose between objects that sank and floated {}", "C", "Heavy objects that sank vs light ones that floated.", ["A", "B", "C", "D", "E", "F"]),
              sel(15, "evidence that birds can learn from the experience of others {}", "D", "Untrapped crows also mobbed the mask.", ["A", "B", "C", "D", "E", "F"]),
              sel(16, "an explanation of how small brains can be so capable {}", "F", "Densely packed neurons.", ["A", "B", "C", "D", "E", "F"]),
              sel(17, "an example of a bird making a tool from an artificial material {}", "B", "Betty bent a piece of wire.", ["A", "B", "C", "D", "E", "F"]),
              sel(18, "a description of birds keeping an object for later use {}", "E", "Ravens kept the tool until the box was available.", ["A", "B", "C", "D", "E", "F"]),
            ] },
            { title: "Questions 19–22", instr: "Match each finding with the correct birds, <b>A–D</b>.", box: box(["New Caledonian crows in the wild", "wild crows in the United States", "ravens", "several corvid species"], "Birds"), questions: [
              sel(19, "shape twigs into hooks to catch insects {}", "A", "Paragraph B."),
              sel(20, "recognised a person by their appearance for years {}", "B", "The mask study."),
              sel(21, "chose an object that would be useful the next day {}", "C", "Paragraph E."),
              sel(22, "dropped stones into tubes of water {}", "D", "Paragraph C."),
            ] },
            { title: "Questions 23–26", instr: "Complete the summary below. Choose <b>ONE WORD ONLY</b> from the passage for each answer.", context: `<div class="qbox" style="font-family:var(--serif);font-size:1rem;line-height:1.8">Bird brains contain neurons packed more <b>(23)</b> ______ than mammal brains of a similar size, so a crow may have as many neurons as some larger <b>(24)</b> ______. This suggests that brain <b>(25)</b> ______ is not a reliable guide to intelligence, and that the insult 'bird brain' may be due for <b>(26)</b> ______.</div>`, questions: [
              gap(23, "Gap 23: {}", "densely", "Paragraph F."),
              gap(24, "Gap 24: {}", "monkeys", "Paragraph F."),
              gap(25, "Gap 25: {}", "size", "“Brain size… may be a poor guide.”"),
              gap(26, "Gap 26: {}", "retirement", "Paragraph F."),
            ] },
          ],
        },
        {
          title: "Can Money Buy Happiness?",
          paras: [
            "In 1974, the economist Richard Easterlin published a finding that has provoked debate ever since. Within a country at a given time, richer people reported being happier than poorer people. Yet over several decades, as average incomes in the United States rose substantially, average reported happiness barely changed. This apparent contradiction became known as the Easterlin paradox.",
            "One explanation is that people judge their income relative to others. If everyone's income rises together, nobody feels better off, because their position compared with their neighbours has not changed. Another is adaptation: people quickly become used to higher living standards, so that a new car or a bigger house provides only a temporary boost to well-being.",
            "Not all economists accept the paradox. Later studies, using data from many more countries and over longer periods, found that people in richer countries do, on average, report higher life satisfaction, and that the relationship between income and satisfaction holds even among wealthy nations. Some researchers argue that Easterlin's original data were too limited to support his conclusion.",
            "Part of the confusion arises because 'happiness' can mean different things. When people are asked to evaluate their life as a whole, their answers rise steadily with income. Day-to-day emotions — how often people feel joy, stress or sadness — show a weaker relationship. An influential study published in 2010 suggested that emotional well-being stopped improving above a certain income level, although more recent research has questioned whether such a plateau exists for most people.",
            "In my view, the evidence points to a conclusion that is less dramatic than either side of the debate sometimes suggests. Money clearly matters, especially for those who lack it: an increase in income makes a far greater difference to a family struggling to pay for food and housing than to one that is already comfortable. But beyond a certain point, the factors that most affect well-being are largely non-financial — health, relationships, meaningful work and a sense of control over one's life.",
            "This has implications for governments. For decades, economic growth, measured by gross domestic product (GDP), has been treated as the main indicator of national progress. Several countries now also publish measures of well-being, and Bhutan famously promotes 'gross national happiness'. Critics argue that such measures are too subjective to guide policy. I think this criticism is overstated. GDP is itself a constructed measure with well-known weaknesses; it counts the cost of cleaning up pollution as economic activity, for instance. Measuring well-being directly, alongside income, can only give a more complete picture.",
            "None of this means that individuals should be indifferent to money. But it does suggest that policies which reduce poverty, protect health and strengthen communities may do more for a nation's happiness than growth alone.",
          ],
          groups: [
            { title: "Questions 27–30", instr: "Choose the correct letter, <b>A, B, C or D</b>.", questions: [
              mcq(27, "The 'Easterlin paradox' refers to the observation that", ["rich people are less happy than poor people.", "rising average incomes did not increase average happiness.", "happiness cannot be measured.", "people in poor countries are happier."], "B", "Paragraph 1."),
              mcq(28, "According to paragraph 2, 'adaptation' means that people", ["compare themselves with their neighbours.", "get used to improvements in their lives.", "save more as they earn more.", "work longer hours."], "B", "“People quickly become used to higher living standards.”"),
              mcq(29, "Later studies described in paragraph 3 found that", ["there is no link between income and satisfaction.", "people in richer countries report higher satisfaction.", "Easterlin's data were complete.", "the link exists only in poor countries."], "B", "Even among wealthy nations."),
              mcq(30, "In paragraph 4, the writer explains the confusion by pointing out that", ["surveys are unreliable.", "'happiness' can refer to life evaluation or to daily emotions.", "income is difficult to measure.", "the 2010 study was wrong."], "B", "Two meanings of happiness."),
            ] },
            { title: "Questions 31–35", instr: "Do the following statements agree with the claims of the writer in Reading Passage 3? Choose <b>YES</b>, <b>NO</b> or <b>NOT GIVEN</b>.", questions: [
              yn(31, "Extra income makes the greatest difference to people who have little money.", "YES", "Paragraph 5."),
              yn(32, "Above a certain level, non-financial factors matter most to well-being.", "YES", "Paragraph 5."),
              yn(33, "Bhutan is the happiest country in the world.", "NOT GIVEN", "Bhutan's policy is mentioned, not its ranking."),
              yn(34, "Well-being measures are too subjective to be useful to governments.", "NO", "“I think this criticism is overstated.”"),
              yn(35, "Individuals should not care about money at all.", "NO", "“None of this means that individuals should be indifferent to money.”"),
            ] },
            { title: "Questions 36–40", instr: "Complete each sentence with the correct ending, <b>A–G</b>.", box: box(["reported higher levels of happiness than poorer people.", "nobody feels better off.", "rise steadily as income increases.", "as a form of economic activity.", "may do more for happiness than growth alone.", "are more accurate than surveys.", "make people less likely to adapt."]), questions: [
              sel(36, "Within one country, richer people {}", "A", "Paragraph 1."),
              sel(37, "If everyone's income rises together, {}", "B", "Paragraph 2."),
              sel(38, "People's evaluations of their life as a whole {}", "C", "Paragraph 4."),
              sel(39, "GDP counts the cost of cleaning up pollution {}", "D", "Paragraph 6."),
              sel(40, "Policies that reduce poverty and protect health {}", "E", "Paragraph 7."),
            ] },
          ],
        },
      ],
    },

    writing: {
      task1: {
        prompt: "The graph below shows the percentage of adults in one country who used different devices to access the internet between 2010 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        chart: { type: "line", title: "Adults using each device to go online (%)", x: [2010, 2013, 2016, 2019, 2022, 2025], series: [["Desktop / laptop", [70, 72, 65, 55, 48, 40]], ["Smartphone", [20, 45, 68, 82, 90, 94]], ["Tablet", [2, 15, 25, 28, 26, 24]]], max: 100, step: 20 },
        plan: [
          "Overview: smartphones rose dramatically to become by far the most common device, overtaking computers around 2016, while computer use declined; tablets grew then levelled off at a much lower level.",
          "Body 1: smartphones 20% → 94%; computers peaked at 72% (2013) then fell to 40%.",
          "Body 2: tablets 2% → peak of 28% (2019), slight fall to 24% by 2025.",
          "Use ‘overtook’, ‘peaked at’, ‘levelled off’, ‘more than quadrupled’.",
        ],
      },
      task2: {
        prompt: "Many young people today say they want to become famous. Why is this? Is it a positive or negative development? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        plan: [
          "Answer both questions in the introduction (two-part question).",
          "Body 1 — reasons: social media makes fame seem achievable; influencers' visible wealth and lifestyle; desire for recognition.",
          "Body 2 — evaluation (e.g. mainly negative): unrealistic expectations, neglect of education/skills, mental health pressures; but can motivate creativity and entrepreneurship.",
          "Conclusion: restate both answers clearly.",
        ],
      },
    },

    speaking: {
      part1: [
        { topic: "Friends", qs: ["How often do you see your friends?", "What do you usually do together?", "Is it easy to make new friends as an adult?", "Do you prefer having a few close friends or many friends?"] },
        { topic: "Technology", qs: ["How much time do you spend on your phone each day?", "Which app do you use most?", "Has technology made your life easier?", "Is there any technology you would like to learn to use?"] },
      ],
      part2: { card: "Describe a journey you remember well.", bullets: ["where you went", "how you travelled", "who you were with"], end: "and explain why you remember this journey so well.", theme: "travel and journeys" },
      part3: ["Why do people enjoy travelling to other countries?", "How has tourism changed in your country in recent years?", "What are the disadvantages of travelling by plane?", "Do you think people will travel more or less in the future?"],
    },
  };
})();
