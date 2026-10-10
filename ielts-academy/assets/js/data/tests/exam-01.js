/* Exam Test 1 — full-length, exam-standard practice test (original Listening, Writing and Speaking). */
(function () {
  "use strict";
  const { gap, mcq, multi, sel, box, part } = window.TB;
  const MAP = ["A", "B", "C", "D", "E", "F", "G", "H"];

  function parkMap() {
    const pin = (l, x, y) => `<g class="map-pin"><circle cx="${x}" cy="${y}" r="13"/><text x="${x}" y="${y + 4.5}" text-anchor="middle">${l}</text></g>`;
    return `<div class="map-wrap"><svg viewBox="0 0 600 380" role="img" aria-label="Map of Hollins Park with places labelled A to H">
      <rect class="map-grass" x="30" y="20" width="540" height="320" rx="10"/>
      <text class="map-label" x="556" y="42" text-anchor="end" style="font-weight:800">N ▲</text>
      <path class="map-path" d="M300 340 L300 168 M128 250 L472 250"/>
      <ellipse class="map-water" cx="300" cy="125" rx="95" ry="45"/><text class="map-label" x="300" y="130" text-anchor="middle">Lake</text>
      <text class="map-label" x="310" y="282" style="font-size:11px">main path</text>
      <text class="map-label" x="312" y="242" style="font-size:11px">crossroads</text>
      <rect fill="var(--paper)" x="284" y="334" width="32" height="12"/>
      <text class="map-label" x="300" y="368" text-anchor="middle" style="font-weight:800">▲ Main gate</text>
      <rect fill="var(--paper)" x="564" y="300" width="12" height="30"/>
      <text class="map-label" x="566" y="362" text-anchor="end" style="font-size:11px">Side gate → car park</text>
      ${pin("A", 108, 250)}${pin("B", 492, 250)}${pin("C", 255, 305)}${pin("D", 345, 305)}
      ${pin("E", 300, 55)}${pin("F", 178, 125)}${pin("G", 422, 125)}${pin("H", 535, 315)}
    </svg></div>`;
  }

  window.IELTS_TESTS.x1 = {
    listening: {
      parts: [
        part(1, "Part 1 · Booking a volunteer weekend", "A woman phones a conservation charity to book a place on a volunteer weekend.", ["Mark (charity officer)", "Sophie (caller)"], [
          [0, "Good morning, Greenfield Conservation Trust, Mark speaking. How can I help?"],
          [1, "Hi. I saw your advert for the volunteer weekends, and I'd like to sign up for one."],
          [0, "Brilliant. We're always glad to have new volunteers. Have you volunteered with us before?"],
          [1, "No, this would be my first time."],
          [0, "OK, so I'll need to take a few details. Could I have your name, please?"],
          [1, "Yes, it's Sophie Hendry."],
          [0, "Is that H, E, N, R, Y, like the first name?"],
          [1, "No, there's a D in it. It's [[H, E, N, D, R, Y]]."],
          [0, "Thanks. And could I ask what you do? We like to know a bit about our volunteers' backgrounds."],
          [1, "Well, until last year I was a student. I was studying biology, actually. But now I'm working as a [[nurse]] at the city hospital."],
          [0, "That's very useful. We always try to have someone with first-aid training in each team."],
          [1, "I'm happy to help with that."],
          [0, "Thanks. And how did you hear about us?"],
          [1, "A friend of mine volunteered with you last year. She said it was hard work but great fun."],
          [0, "That's good to hear. Most of our volunteers come to us through friends, actually."],
          [0, "Now, which weekend were you interested in? We have two this month."],
          [1, "The advert said the 14th and 15th of June."],
          [0, "I'm afraid that one's fully booked now. But we still have places on the weekend of the [[21st]] and 22nd."],
          [1, "That's fine. I'm free then too."],
          [0, "Great. That weekend we'll be working at [[Ashcombe]] Woods. That's A, S, H, C, O, M, B, E."],
          [1, "I don't think I know it. Is it far?"],
          [0, "About twenty miles north of the city. It's an old woodland that we're slowly restoring."],
          [1, "And what will we be doing? Planting trees?"],
          [0, "We did a lot of tree planting there in the spring. This time the main job is planting [[hedges]] along the edges of the fields, to give birds and small animals somewhere to shelter and to move between the woods."],
          [1, "That sounds good. How do we get there?"],
          [0, "We run a minibus. In the past it left from the library car park, but there were problems with parking, so now it leaves from outside the [[station]], by the main entrance."],
          [1, "OK. And what time does it leave?"],
          [0, "It leaves at [[8:15]] on Saturday morning. Please try to be there ten minutes early, because we can't wait for latecomers."],
          [1, "Right. Is there anything I need to bring?"],
          [0, "We provide all the tools and gloves, so don't worry about those. But you'll need waterproof clothing and, most importantly, strong [[boots]]. Trainers aren't suitable, I'm afraid, as the ground can be very muddy."],
          [1, "OK. What about food?"],
          [0, "Lunch and dinner are provided on both days. If you have any special dietary needs, just let us know."],
          [1, "I'm vegetarian, but that's probably not a problem."],
          [0, "Not at all. Most of our meals are vegetarian anyway."],
          [1, "Good. And how many hours a day will we be working?"],
          [0, "We usually start at about nine and finish around four, with a long break for lunch. Nobody is expected to work non-stop, and there are always lighter jobs for anyone who gets tired."],
          [1, "That sounds manageable."],
          [1, "And where do we stay overnight? Do I need to bring a tent?"],
          [0, "No, there's no camping this time. We stay in a converted [[barn]] on the farm next to the woods. It has bunk beds, showers and a kitchen, so it's quite comfortable."],
          [1, "Lovely. And how much does the weekend cost?"],
          [0, "For members of the Trust, it's twenty-five pounds, including food and accommodation. For non-members, it's [[£35]]."],
          [1, "I'm not a member yet, so I'll pay the full price for now."],
          [0, "That's fine. You can always join later. Membership is only twelve pounds a year, and it gives you discounts on all our events."],
          [1, "I'll think about it. How do I pay?"],
          [0, "I'll send you an email with a link to our booking page, and you can pay online there."],
          [0, "Oh, and one more thing. We'll need the name and phone number of someone we can contact in an emergency. You can add that on the booking page."],
          [1, "No problem. I'll put my sister's details."],
          [1, "Great. Thanks very much for your help."],
          [0, "You're welcome, Sophie. See you on the 21st."],
        ], { split: ["Right. Is there anything I need to bring?", "1 to 7", "8 to 10"], check: true }),
        part(2, "Part 2 · A welcome talk at Hollins Park", "The manager of a city park gives a talk to a group of visitors.", ["Helen (park manager)"], [
          [0, "Good morning, everyone, and welcome to Hollins Park. My name's Helen Carter, and I'm the park manager. Before you set off to explore, I'd like to tell you a little about the park's history, what's new this year, and how to find your way around."],
          [0, "Let's start with some history. Many people assume that the park was always public land, or that it was once farmland, like the fields to the south of it. In fact, it began life as [[the gardens of a large private house]]. The house was built in 1820 by a wealthy merchant, and his family lived here for almost a century. During the First World War the house was used for a short time as a hospital, and in 1921 the family sold the whole estate to the city. Sadly, the house itself burned down in the 1950s, but many of the trees the family planted are still standing."],
          [0, "The park is open every day from seven in the morning until it gets dark, and entry is free. It covers about forty hectares, so you'll need at least two hours to see everything properly."],
          [0, "Over the last two years, the park has been through a major renovation. We've repaired the paths, cleaned the lake and replaced all the old play equipment. People often ask who paid for all this. The city council made a contribution, and several local businesses sponsored new benches, which we're very grateful for. But the vast majority of the money, about three million pounds, came from [[a national lottery grant]], which we were awarded after a long application process."],
          [0, "Now, what's new this year? Some of you may have joined one of our guided walks. They've been running for over ten years now and are as popular as ever. We're also planning to introduce electric bike hire, but that won't be ready until next spring. The big new attraction this summer is [[an open-air theatre]] next to the lake. There'll be performances every Friday and Saturday evening from June to August, and tickets are available from the information point."],
          [0, "A quick word about dogs. Dogs are very welcome in Hollins Park, and in most areas they can run freely. However, because of the nesting birds, [[they must be kept on a lead within twenty metres of the lake]]. There are signs to remind you."],
          [0, "Right, let me help you find your way around. If you look at the map in your leaflet, you'll see the main gate at the bottom, where we are now. As you come in through the main gate, the first building on your right is [[the café]]. It does excellent breakfasts, and it's open from eight every morning. Opposite the café, on your left, is the information point, where you can pick up maps and theatre tickets."],
          [0, "If you walk up the main path, you'll come to a crossroads. Turn left there and follow that path all the way to the end, and you'll find [[the adventure playground]]. It's designed for children aged five to twelve, and there's a separate area for toddlers."],
          [0, "If you turn right at the crossroads instead, the path takes you to [[the rose garden]], right at the end. It's at its best in June, so you've chosen a good time to visit."],
          [0, "Back at the crossroads, if you carry straight on up the main path, you'll reach the lake. Rowing boats can be hired from [[the boat hire hut]], which is on the far side of the lake, directly opposite the point where the main path meets the water. You'll need to walk round the lake to get to it."],
          [0, "A lot of regular visitors still expect to find the picnic area on the eastern side of the lake, where it used to be. That area is now a wildflower meadow, so please don't walk through it. [[The new picnic area]] is on the western shore, on your left as you reach the lake. There are plenty of tables, and barbecues are allowed in that area only."],
          [0, "Finally, the toilets. The main toilet block is [[in the bottom right-hand corner of the map]], next to the side gate that leads to the car park. There are also toilets in the café for customers."],
          [0, "Right, that's everything from me. Enjoy your day in the park."],
        ], { split: ["Right, let me help you find your way around. If you look at the map in your leaflet, you'll see the main gate at the bottom, where we are now. As you come in through the main gate, the first building on your right is [[the café]]. It does excellent breakfasts, and it's open from eight every morning. Opposite the café, on your left, is the information point, where you can pick up maps and theatre tickets.", "11 to 14", "15 to 20"], check: true }),
        part(3, "Part 3 · Discussing a research report", "Two students, Hana and Josh, discuss the first draft of their report on food waste with their tutor, Dr Patel.", ["Dr Patel (tutor)", "Hana (student)", "Josh (student)"], [
          [0, "Come in, Hana, Josh. So you've finished the first draft of your report on food waste in the university canteen. How did the survey go?"],
          [1, "Mostly well, but there were a few problems. The biggest one was that [[a lot of students didn't finish the questionnaire]]. They answered the first few questions and then just stopped."],
          [0, "That's common with online surveys. Was it too long?"],
          [2, "Probably. It had thirty questions, which seemed reasonable to us at the time. The other issue was that [[some of the questions were unclear]]. For example, we asked how often people waste food, and people understood that in completely different ways."],
          [0, "What about the number of responses? Did you get enough?"],
          [1, "Actually, that was fine. We got over four hundred responses, which is more than we expected. And the canteen staff were really helpful, so getting permission wasn't a problem at all."],
          [0, "Good. And what did you find?"],
          [2, "Well, some of it was what we expected. Most waste happens at lunchtime, when the canteen is busiest. But two things really surprised us. First, [[vegetables weren't the most wasted food]], as we'd assumed. It was actually bread. The canteen gives a free bread roll with every meal, and most of them are thrown away."],
          [1, "And the second surprise was that [[students who cook for themselves at home wasted just as much in the canteen]] as students who never cook. We thought people who cook would be more careful."],
          [0, "Interesting. Did the time of year make any difference?"],
          [2, "Not really. The figures were similar in every month we looked at."],
          [0, "And do you think your sample was representative of the whole student population?"],
          [1, "Not entirely. Most of the people who answered were first-year students, because we advertised the survey in the first-year halls of residence. Older students probably eat in the canteen less often anyway."],
          [0, "That's worth mentioning as a limitation. Readers like to see that you understand the weaknesses of your own research."],
          [2, "We could add a short paragraph about that at the end."],
          [0, "Right, let's go through the report section by section. Your introduction is a little long. You spend almost a page on global statistics about food waste. [[I'd cut most of that]] and get to your own research more quickly."],
          [1, "OK, that's easy to fix."],
          [0, "The method section is accurate, but at the moment it's hard to follow the order in which you did things. A simple [[diagram]] showing each stage would really help the reader."],
          [2, "Good idea. I can do that."],
          [0, "Now, the results. I think these are excellent, and the charts are very clear. [[I wouldn't change anything there]]."],
          [1, "That's a relief. We spent a long time on those charts."],
          [2, "We weren't sure whether to include all the raw data as well."],
          [0, "Put that in an appendix at the end. It doesn't need to go in the main text."],
          [0, "The discussion is good, but it's missing something. You've put your comments about why the bread rolls are wasted in the results section. Those comments are interpretation, not results, so they [[belong in the discussion]]."],
          [2, "So we should take them out of the results and put them in the discussion?"],
          [0, "Exactly. Then your recommendations. The ideas are sensible, and you've given plenty of examples, so you don't need any more. The problem is the language. Phrases like 'the canteen should totally stop doing this' are too chatty. It needs to be [[more formal]]."],
          [1, "Fair enough. We wrote that part in a hurry."],
          [0, "And finally, the references. There are a few mistakes in the way you've listed them, so please check them carefully against [[the university's style guide]]."],
          [2, "We will. Thanks, Dr Patel. This is really helpful."],
        ], { split: ["Right, let's go through the report section by section. Your introduction is a little long. You spend almost a page on global statistics about food waste. [[I'd cut most of that]] and get to your own research more quickly.", "21 to 24", "25 to 30"], check: true }),
        part(4, "Part 4 · Lecture: biomimicry", "A lecture on biomimicry: designing products and buildings by learning from nature.", ["Lecturer"], [
          [0, "Good morning. Today I'm going to talk about biomimicry, which means solving human design problems by imitating the forms and processes found in nature. The idea itself is very old, but the term became widely known in 1997, when the American [[writer]] Janine Benyus published a book with that title. Her argument was simple: living things have had millions of years to find efficient solutions, so we should study them more carefully before we design anything."],
          [0, "Let's begin with the most famous example. In 1941, a Swiss engineer called George de Mestral went for a walk in the mountains with his dog. When he got home, he noticed that both his trousers and the dog's [[fur]] were covered in small, sticky seeds. Looking at them under a microscope, he saw that each seed was covered in tiny hooks that caught on anything with loops. It took him years of experiments, but the result was Velcro, a fastener made of hooks on one side and loops on the other."],
          [0, "Velcro was not an immediate success. Many people thought it looked cheap, and it only became popular after it was used on space suits in the 1960s. Today, of course, you can find it on everything from children's shoes to medical equipment."],
          [0, "A more recent example comes from Japan. When the first high-speed trains came out of tunnels, they pushed air ahead of them, causing a loud bang that disturbed people living nearby. One of the engineers working on the problem was a keen birdwatcher, and he had noticed how the [[kingfisher]] dives into water to catch fish with hardly a splash. The bird's long, narrow beak allows it to move smoothly from air into water. So the engineers redesigned the front of the train to copy the shape of the beak. The new trains were much quieter, and they also travelled faster and used about fifteen per cent less [[electricity]]."],
          [0, "Biomimicry has also influenced architecture. In hot climates, cooling buildings can use enormous amounts of energy. In the 1990s, the architect of a large office and shopping complex in Harare, in Zimbabwe, looked for inspiration to the [[mounds]] built by termites. Termites keep the temperature inside these structures remarkably stable, even when the temperature outside changes sharply between day and night. They do this through a system of tunnels and openings that allows air to circulate. The building in Harare uses a similar principle. Air is drawn in, cooled by the building's heavy concrete structure and released through chimneys at the top. As a result, the building has no conventional air-[[conditioning]], and it uses far less energy than other buildings of its size."],
          [0, "My next example is the lotus plant, which grows in muddy water but always appears perfectly clean. Scientists who studied the leaves under a microscope found that their surface is covered in tiny bumps coated with wax. Water cannot spread out on this surface, so it forms round [[droplets]] that roll off the leaf, picking up dirt as they go. This became known as the lotus effect, and it has been used to develop a self-cleaning [[paint]] for the outside of buildings, which stays clean simply when it rains."],
          [0, "However, biomimicry is not always successful. One common mistake is copying the appearance of a natural form without understanding its [[function]]. A building may look like a shell or a leaf, but if it doesn't work like one, it is really just decoration. Good biomimicry starts with a question about how something works, not with what it looks like."],
          [0, "Another problem is cost. Living things usually build their structures at normal temperatures, using very little energy and only a few simple materials. Reproducing those structures in a factory can be extremely difficult and expensive, which is why many promising ideas never leave the laboratory."],
          [0, "Finally, let's look to the future. One of the most exciting areas of research is self-healing materials. Our own [[skin]] can repair small cuts without any outside help, and researchers are now developing plastics and concretes that can do something similar, by releasing a repairing substance when they crack. If these materials become cheap enough, they could make bridges, roads and buildings last much longer. In the next lecture, we'll look at this research in more detail."],
        ], { check: true }),
      ],
      groups: [
        { title: "Part 1 · Questions 1–7", instr: "Complete the form below. Write <b>ONE WORD AND/OR A NUMBER</b> for each answer.", notes: "GREENFIELD CONSERVATION TRUST · Volunteer weekend booking", questions: [
          gap(1, "Name: Sophie {}", "Hendry", "Spelled H-E-N-D-R-Y: “there's a D in it”."),
          gap(2, "Occupation: {}", "nurse", "She was a biology student “until last year”, but now she is “working as a nurse at the city hospital”."),
          gap(3, "Weekend: {} – 22 June", ["21st", "21"], "The 14th–15th weekend is “fully booked now”."),
          gap(4, "Location: {} Woods", "Ashcombe", "Spelled out: “A, S, H, C, O, M, B, E”."),
          gap(5, "Main task: planting {}", "hedges", "Tree planting was done “in the spring”. This time “the main job is planting hedges”."),
          gap(6, "Minibus leaves from outside the {}", "station", "It used to leave from “the library car park”, but not any more."),
          gap(7, "Departure time on Saturday: {}", ["8:15", "8.15", "8.15am", "8:15am"], "“It leaves at 8:15 on Saturday morning.” Arriving ten minutes early is advice, not the departure time."),
        ] },
        { title: "Part 1 · Questions 8–10", instr: "Complete the notes below. Write <b>ONE WORD AND/OR A NUMBER</b> for each answer.", notes: "Practical information", questions: [
          gap(8, "Bring: waterproof clothing and strong {}", "boots", "Tools and gloves are provided, and “Trainers aren't suitable”."),
          gap(9, "Accommodation: a converted {}", "barn", "“there's no camping this time”."),
          gap(10, "Cost for non-members: £{}", "35", "“For members of the Trust, it's twenty-five pounds”, but Sophie is not a member."),
        ] },
        { title: "Part 2 · Questions 11–14", instr: "Choose the correct letter, <b>A, B or C</b>.", questions: [
          mcq(11, "What was the land that is now Hollins Park originally?", ["the garden of a private house", "farmland", "the grounds of a hospital"], "A", "“it began life as the gardens of a large private house”. Farmland is to the south; the hospital was only “for a short time” during the war."),
          mcq(12, "Most of the money for the renovation came from", ["the city council.", "a lottery grant.", "local businesses."], "B", "The council and businesses contributed, “But the vast majority of the money … came from a national lottery grant”."),
          mcq(13, "What is new at the park this year?", ["guided walks", "an outdoor theatre", "electric bike hire"], "B", "Guided walks have been “running for over ten years”; bike hire “won't be ready until next spring”. New: “an open-air theatre”."),
          mcq(14, "What does the speaker say about dogs?", ["They are not allowed in some areas.", "They can run freely everywhere.", "They must be on a lead near the lake."], "C", "“they must be kept on a lead within twenty metres of the lake”."),
        ] },
        { title: "Part 2 · Questions 15–20", instr: "Label the map below. Choose the correct letter, <b>A–H</b>.", context: parkMap(), questions: [
          sel(15, "Café {}", "D", "“As you come in through the main gate, the first building on your right is the café.” On the map, right of the main path near the gate is D. C (on the left) is the information point.", MAP),
          sel(16, "Adventure playground {}", "A", "“Turn left there and follow that path all the way to the end”: the left end of the cross path.", MAP),
          sel(17, "Rose garden {}", "B", "“If you turn right at the crossroads instead, the path takes you to the rose garden, right at the end.”", MAP),
          sel(18, "Boat hire {}", "E", "“on the far side of the lake, directly opposite the point where the main path meets the water”: the north side, E.", MAP),
          sel(19, "Picnic area {}", "F", "The eastern side (G) is “now a wildflower meadow”. The picnic area “is on the western shore, on your left as you reach the lake”.", MAP),
          sel(20, "Toilets {}", "H", "“in the bottom right-hand corner of the map, next to the side gate that leads to the car park”.", MAP),
        ] },
        { title: "Part 3 · Questions 21–22", instr: "Choose <b>TWO</b> letters, <b>A–E</b>.", questions: [
          multi([21, 22], "Which TWO problems did the students have with their survey?", ["Too few students took part.", "Many students did not complete it.", "The canteen staff were unhelpful.", "Some questions were confusing.", "Getting permission took a long time."], ["B", "D"], "“a lot of students didn't finish the questionnaire” (B) and “some of the questions were unclear” (D). They got “over four hundred responses” and the staff “were really helpful”."),
        ] },
        { title: "Part 3 · Questions 23–24", instr: "Choose <b>TWO</b> letters, <b>A–E</b>.", questions: [
          multi([23, 24], "Which TWO findings surprised the students?", ["Most food was wasted at lunchtime.", "More bread was wasted than any other food.", "Students who cook wasted as much as other students.", "Waste was higher in some months than others.", "Portions were too small."], ["B", "C"], "Lunchtime waste was “what we expected”. The surprises: “vegetables weren't the most wasted food … It was actually bread” (B) and students who cook “wasted just as much” (C). The months were “similar”."),
        ] },
        { title: "Part 3 · Questions 25–30", instr: "What does Dr Patel say about each section of the report? Choose <b>SIX</b> answers from the box and write the correct letter, <b>A–G</b>.", box: box(["Make it shorter.", "Add a visual.", "Leave it as it is.", "Move some material into it.", "Use a more formal style.", "Add more examples.", "Check it against a guide."], "Comments"), questions: [
          sel(25, "Introduction {}", "A", "“Your introduction is a little long … I'd cut most of that”."),
          sel(26, "Method {}", "B", "“A simple diagram showing each stage would really help the reader.”"),
          sel(27, "Results {}", "C", "“I wouldn't change anything there.”"),
          sel(28, "Discussion {}", "D", "The comments in the results section “belong in the discussion”."),
          sel(29, "Recommendations {}", "E", "“you don't need any more” examples, so not F. “It needs to be more formal.”"),
          sel(30, "References {}", "G", "“check them carefully against the university's style guide”."),
        ] },
        { title: "Part 4 · Questions 31–40", instr: "Complete the notes below. Write <b>ONE WORD ONLY</b> for each answer.", notes: "BIOMIMICRY: LEARNING FROM NATURE", questions: [
          gap(31, "Term made popular in 1997 by a {} called Janine Benyus", "writer", "“the American writer Janine Benyus published a book with that title”."),
          gap(32, "Velcro: inspired by seeds stuck to a dog's {}", "fur", "“both his trousers and the dog's fur were covered in small, sticky seeds”."),
          gap(33, "Japanese high-speed train: front copies the beak of the {}", "kingfisher", "The bird dives “with hardly a splash”."),
          gap(34, "New design: quieter, faster, and uses less {}", "electricity", "“used about fifteen per cent less electricity”."),
          gap(35, "Building in Harare: inspired by termite {}", "mounds", "“the mounds built by termites”."),
          gap(36, "The building has no conventional air-{}", ["conditioning", "air-conditioning"], "Air is “cooled by the building's heavy concrete structure”, so there is no air-conditioning."),
          gap(37, "Lotus leaf: water forms {} that roll off and collect dirt", "droplets", "“it forms round droplets that roll off the leaf, picking up dirt”."),
          gap(38, "Lotus effect used in a self-cleaning {} for buildings", "paint", "“a self-cleaning paint for the outside of buildings”."),
          gap(39, "Common mistake: copying a form without understanding its {}", "function", "“copying the appearance of a natural form without understanding its function”."),
          gap(40, "Future: self-healing materials, like human {}", "skin", "“Our own skin can repair small cuts without any outside help”."),
        ] },
      ],
    },
    reading: null,
    writing: {
      task1: {
        prompt: "The graph below shows the percentage of electricity generated from renewable sources in four countries between 2000 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        chart: { type: "line", title: "Electricity from renewable sources (% of total) · practice data", x: [2000, 2005, 2010, 2015, 2020, 2025], series: [["Norvia", [62, 64, 66, 70, 74, 78]], ["Castel", [8, 10, 18, 31, 44, 52]], ["Brenmark", [15, 16, 17, 19, 22, 25]], ["Ostra", [30, 27, 24, 22, 23, 29]]], max: 80, step: 20 },
        plan: [
          "Overview: Norvia had by far the highest share throughout, but Castel saw the most dramatic growth (from the lowest to second-highest). Brenmark rose slowly, while Ostra dipped and then recovered.",
          "Body 1: Norvia: 62% → 78% (steady rise). Castel: 8% in 2000, rising sharply after 2005 to 52% by 2025, overtaking Brenmark by 2010 and Ostra between 2010 and 2015.",
          "Body 2: Ostra: fell from 30% to a low of 22% in 2015, then climbed back to 29%. Brenmark: only 15% → 25%, the lowest figure in 2025.",
          "Every figure attached to a trend or comparison; no year-by-year listing.",
        ],
      },
      task2: {
        prompt: "Some people think that governments should invest more in high-speed rail networks, while others believe that the money would be better spent on improving local public transport. Discuss both views and give your own opinion. Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        plan: [
          "Intro: paraphrase the debate + opinion (e.g. local transport should come first, high-speed rail only where demand is proven).",
          "Body 1 (high-speed rail): shorter journeys between cities, alternative to short-haul flights (emissions), economic development of regional cities; e.g. high-speed lines in Japan or Spain.",
          "Body 2 (local transport): affects far more people every day; reduces congestion and pollution in cities; cheaper per passenger; e.g. frequent buses and metro lines.",
          "Conclusion: balanced judgement with a clear priority.",
        ],
      },
    },
    speaking: {
      part1: [
        { topic: "Weather", qs: ["What's the weather usually like where you live?", "What kind of weather do you like best? Why?", "Does the weather affect your mood?", "Has the weather in your country changed in recent years?"] },
        { topic: "Museums", qs: ["Did you visit museums when you were a child?", "Do you prefer museums or art galleries?", "Should museums be free to enter?", "Would you like to work in a museum?"] },
      ],
      part2: { card: "Describe a time when you helped to protect the environment.", bullets: ["what you did", "when and where you did it", "who you did it with"], end: "and explain how you felt about doing it.", theme: "the environment" },
      part3: ["Why do some people not care about environmental problems?", "Should environmental protection be taught in schools?", "Which is more effective in protecting the environment: individual actions or government policies?", "Do you think companies should be fined for causing pollution?", "How will people's attitudes to the environment change in the future?"],
    },
  };
})();
