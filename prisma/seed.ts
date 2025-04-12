import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Create a manager first for the posts
  const manager = await prisma.manager.create({
    data: {
      id: "baroAdmin",
      password: "baro123",
    },
  });

  // Seed job postings
  const jobData = [
    {
      title: "Hardware Developer",
      experience: "3+ years",
      location: "Seoul, Gangnam",
      employmentType: "Full-time",
      deadline: new Date("2024-09-30"),
      isAlwaysRecruiting: false,
      content:
        "We are looking for an experienced Hardware Developer to join our R&D team. The ideal candidate will have experience with circuit design, PCB layout, and prototyping. Responsibilities include developing new hardware products, testing prototypes, and collaborating with software engineers.",
    },
    {
      title: "Electrical Technician",
      experience: "5+ years",
      location: "Seoul, Gangnam",
      employmentType: "Full-time",
      deadline: new Date("2024-10-15"),
      isAlwaysRecruiting: false,
      content:
        "Seeking an Electrical Technician with at least 5 years of experience in industrial electrical systems. The successful candidate will be responsible for installation, maintenance, and troubleshooting of electrical equipment and control systems.",
    },
    {
      title: "Lathe Machining Operator",
      experience: "Entry level",
      location: "Gyeonggi, Seongnam, Bundang",
      employmentType: "Internship",
      deadline: new Date("2024-09-20"),
      isAlwaysRecruiting: false,
      content:
        "Great opportunity for beginners interested in machining. We provide comprehensive training on lathe operation, blueprint reading, and quality control procedures. This position offers hands-on experience in a manufacturing environment.",
    },
    {
      title: "3D CAD Technician",
      experience: "2+ years",
      location: "Seoul, Gangnam (Remote possible)",
      employmentType: "Full-time",
      deadline: null,
      isAlwaysRecruiting: true,
      content:
        "Join our design team as a 3D CAD Technician. Must be proficient in SolidWorks or similar CAD software. Responsibilities include creating detailed 3D models, technical drawings, and collaborating with the engineering team. Remote work options available.",
    },
    {
      title: "Project Manager",
      experience: "5+ years",
      location: "Gyeonggi, Seongnam, Bundang",
      employmentType: "Full-time",
      deadline: new Date("2024-10-31"),
      isAlwaysRecruiting: false,
      content:
        "Experienced Project Manager needed to lead cross-functional teams in delivering complex technical projects. Must have strong leadership skills, experience with agile methodologies, and excellent communication abilities.",
    },
    {
      title: "Project Leader",
      experience: "Any experience level",
      location: "Seoul, Gangnam",
      employmentType: "Contract",
      deadline: new Date("2024-09-25"),
      isAlwaysRecruiting: false,
      content:
        "We're hiring a Project Leader to coordinate technical project execution. The ideal candidate will have technical background, strong organizational skills, and the ability to manage multiple priorities simultaneously.",
    },
    {
      title: "Marketer",
      experience: "Entry level",
      location: "Seoul, Gangnam",
      employmentType: "Internship",
      deadline: new Date("2024-09-18"),
      isAlwaysRecruiting: false,
      content:
        "Marketing internship opportunity for recent graduates. Learn digital marketing strategies, social media management, content creation, and campaign analysis. Great opportunity to build your portfolio and gain practical experience.",
    },
    {
      title: "Technical Sales Representative",
      experience: "3+ years",
      location: "All Seoul areas",
      employmentType: "Full-time",
      deadline: null,
      isAlwaysRecruiting: true,
      content:
        "Seeking experienced Technical Sales Representatives to join our expanding team. Must have technical background and sales experience. Responsibilities include client relationship management, product demonstrations, and solution consulting.",
    },
  ];

  // Insert job data
  for (const job of jobData) {
    await prisma.job.create({
      data: job,
    });
  }

  // Create notice posts (isNotice = true)
  const noticePosts = [
    {
      title: "Terms of Service Update Notice",
      isNotice: true,
      content:
        "Dear valued customers,\n\nWe are writing to inform you about upcoming changes to our Terms of Service, effective October 1, 2024.\n\nKey changes include:\n- Updated data handling procedures\n- Revised payment processing terms\n- Clarified dispute resolution process\n- Enhanced user rights and responsibilities\n\nPlease review the full terms at your convenience. If you continue to use our services after October 1, 2024, you will be deemed to have accepted these changes.\n\nThank you for your continued support.\n\nSincerely,\nThe Management Team",
      managerId: manager.id,
    },
    {
      title: "Privacy Policy Amendment",
      isNotice: true,
      content:
        "Important Notice: Privacy Policy Changes\n\nEffective Date: September 30, 2024\n\nDear Users,\n\nWe value your privacy and want to inform you that we have updated our Privacy Policy to provide greater transparency about how we collect, use, and protect your information.\n\nKey updates include:\n- Enhanced data subject rights\n- More detailed information about data processing practices\n- Updated third-party service provider list\n- Clarification on international data transfers\n\nThe updated Privacy Policy can be found on our website under 'Legal'. If you have any questions about these changes, please contact our Data Protection Officer at privacy@example.com.\n\nThank you for your trust and continued support.",
      managerId: manager.id,
    },
    {
      title: "Autumn Season Special Event - 10% Discount",
      isNotice: true,
      content:
        "Celebrate Autumn with Our Special Discount Event!\n\nDear Customers,\n\nAs the leaves begin to change, we're excited to announce our Autumn Season Special Event featuring a 10% discount on all products and services!\n\nEvent Details:\n- Duration: September 15 - October 15, 2024\n- Discount: 10% off all purchases\n- How to Apply: Use code AUTUMN2024 at checkout\n- Applicable: Both online and in-store purchases\n\nThis is the perfect opportunity to upgrade your equipment or try our premium services at a special rate. The discount applies to both new purchases and renewals.\n\nDon't miss out on this limited-time offer!\n\nWarm regards,\nThe Marketing Team",
      managerId: manager.id,
    },
  ];

  // Insert notice posts
  for (const post of noticePosts) {
    await prisma.post.create({
      data: post,
    });
  }

  const regularPosts = [
    {
      title: "CNC Parts Production Timeline Inquiry",
      isNotice: false,
      content:
        "Hello,\n\nI placed an order (Order #CNC-5782) for 50 custom aluminum brackets on September 2, 2024. The estimated production and delivery time was 10-14 business days, but I haven't received any status update yet. Could you please check the production status of my order and provide an updated delivery timeframe? This is affecting our assembly schedule.\n\nThank you,\nRobert Chen\nMechanical Engineer, Robotics Solutions Inc.",
      managerId: manager.id,
    },
    {
      title: "Technical Question About Steel Stamping Finish",
      isNotice: false,
      content:
        "Manufacturing Team,\n\nWe recently received our order of stamped steel components (Order #ST-3427), and while the dimensions are perfect, we noticed some inconsistency in the surface finish. Some parts have a slightly rougher texture than our previous orders.\n\nCould you advise if there's been any change in your stamping process? Our application requires a consistent surface finish for proper coating adhesion.\n\nI've attached photos to your email support address for reference.\n\nBest regards,\nEmily Johnson\nQuality Control Manager, AutoParts Global",
      managerId: manager.id,
    },
    {
      title: "Feedback on New 5-Axis CNC Machining Service",
      isNotice: false,
      content:
        "To the Production Team,\n\nI wanted to share some positive feedback on your new 5-axis CNC machining service. The complex aerospace components we ordered last month (Order #CNC-6035) were manufactured with exceptional precision.\n\nThe tolerances were maintained perfectly across all features, and the surface finish exceeded our expectations. This level of quality has convinced us to shift more of our complex parts to your facility.\n\nOne small suggestion: providing a detailed measurement report for critical dimensions would be helpful for our quality documentation.\n\nRegards,\nMichael Rivera\nProcurement Director, AeroTech Industries",
      managerId: manager.id,
    },
    {
      title: "Request for Quote: Large Batch Metal Stamping Project",
      isNotice: false,
      content:
        "Sales Department,\n\nI represent Elektra Electronics, and we're looking for a manufacturing partner for an upcoming project requiring high-volume metal stamping services. We need approximately 100,000 units of three different stainless steel components for consumer electronics devices.\n\nCould you please provide information about:\n- Production capacity for large volume orders\n- Lead time for tooling development\n- Per-unit pricing at 100K volume\n- Material options (304 vs 316 stainless)\n- Quality control procedures\n- Packaging and shipping options\n\nWe're finalizing our supplier selection within the next three weeks and would appreciate a comprehensive quote.\n\nThank you,\nSarah Wilson\nProcurement Manager, Elektra Electronics",
      managerId: manager.id,
    },
    {
      title: "Material Compatibility Question for 3D Printing",
      isNotice: false,
      content:
        "Dear Technical Team,\n\nWe're developing a prototype that requires both high heat resistance and chemical resistance to mild acids. I'm considering your SLS nylon printing service, but I'm unsure if it's suitable for our application.\n\nThe component will be exposed to temperatures up to 120°C and occasional contact with dilute phosphoric acid. Could you advise on the most appropriate material from your catalog, or suggest if we should consider alternative manufacturing methods like CNC machining instead?\n\nThank you for your expertise.\n\nSincerely,\nDavid Garcia\nR&D Engineer, ChemTech Solutions",
      managerId: manager.id,
    },
    {
      title: "Urgent: Dimensional Issue with Recent Order",
      isNotice: false,
      content:
        "Quality Control Department,\n\nWe've identified a critical dimensional issue with our recent order of machined aluminum housings (Order #CNC-6104). The mounting hole pattern on approximately 30% of the delivered parts is offset by 0.2mm, which is causing alignment problems in our assembly process.\n\nWe've inspected all 200 units and identified 58 defective parts. This is disrupting our production schedule, and we need replacements urgently.\n\nPlease advise on the fastest resolution path. We can send photos and measurement data immediately.\n\nUrgently awaiting your response,\nJessica Tran\nOperations Manager, InnoTech Systems",
      managerId: manager.id,
    },
    {
      title: "Request for Design Assistance: Metal-to-Plastic Conversion",
      isNotice: false,
      content:
        "Engineering Team,\n\nWe're looking to reduce weight in one of our products by converting several metal components to high-performance plastics. Our team is considering either injection molding or 3D printing for these parts.\n\nGiven your expertise in both metalworking and additive manufacturing, we'd appreciate your design assistance for optimizing these components for plastic production while maintaining structural integrity.\n\nSpecifically, we're concerned about:\n- Wall thickness requirements\n- Support structures or ribs needed\n- Material selection for load-bearing applications\n- Cost comparison between small batch 3D printing vs. tooling for injection molding\n\nWould your design team be available for a consultation session next week?\n\nBest regards,\nThomas Lee\nProduct Development Manager, LightTech Innovations",
      managerId: manager.id,
    },
    {
      title: "Certifications for Medical Device Manufacturing",
      isNotice: false,
      content:
        "Compliance Department,\n\nOur medical device company is evaluating potential manufacturing partners for precision components in a Class II medical device. Before proceeding with sample orders, we need to confirm your facility's certifications and quality management systems.\n\nSpecifically, could you provide information regarding:\n- ISO 13485:2016 certification status\n- Clean room capabilities (if any)\n- Material traceability processes\n- Experience with FDA-regulated products\n- Documentation protocols for validation and verification\n\nIf you meet these requirements, we'd like to schedule a facility audit as the next step in our supplier qualification process.\n\nThank you,\nDr. Amara Singh\nQuality Assurance Director, MediTech Devices",
      managerId: manager.id,
    },
    {
      title: "Reducing Lead Time for Repeat Orders",
      isNotice: false,
      content:
        "Production Planning Team,\n\nWe've been ordering the same set of CNC machined components (Part #A-7235, #A-7236, and #A-7237) for the past year, approximately every two months. The current lead time of 3 weeks is becoming challenging for our production schedule.\n\nI'd like to discuss options for reducing this lead time for these repeat orders. Would it be possible to:\n- Implement a blanket order arrangement\n- Keep certain raw materials in stock for our common orders\n- Reserve machine time in advance of our formal PO\n- Consider any production efficiency improvements\n\nWe're forecasting increased demand in the coming year and would value a more streamlined ordering process.\n\nBest regards,\nAndrew Yoshida\nSupply Chain Manager, RoboTronics",
      managerId: manager.id,
    },
    {
      title: "Samples Request for Material Testing",
      isNotice: false,
      content:
        "Sales Support,\n\nOur company is evaluating different materials and manufacturing processes for an upcoming automotive component. We'd like to request samples of your capabilities in the following:\n\n1. 316L stainless steel (CNC machined, 50x50x10mm test coupon)\n2. 7075-T6 aluminum (CNC machined, same dimensions)\n3. Carbon fiber reinforced nylon (3D printed, same dimensions)\n4. Cold-rolled steel (stamped, 0.8mm thickness, 50mm diameter disc)\n\nWe'll be conducting mechanical testing, environmental exposure tests, and finishing trials on these samples. We're happy to cover reasonable costs for these test pieces.\n\nPlease let me know if you can provide these samples within the next two weeks.\n\nRegards,\nLisa Nakamura\nMaterials Engineer, NextGen Automotive",
      managerId: manager.id,
    },
    {
      title: "File Format Question for 3D Printing Service",
      isNotice: false,
      content:
        "Technical Support,\n\nI'm preparing to submit a complex model for 3D printing but I'm unsure about the optimal file format and settings. The part has several thin-walled features and internal channels that need to be preserved accurately.\n\nDo you prefer STL, STEP, or another format for your workflow? Also, what are your recommendations for:\n- Minimum wall thickness\n- Minimum feature size\n- Optimal orientation to minimize support structures\n- Resolution settings for the STL export\n\nThe part will be approximately 150x80x60mm in your high-detail resin material.\n\nThanks for your guidance,\nKevin Zhang\nProduct Designer, Innovation Labs",
      managerId: manager.id,
    },
    {
      title: "Request for On-site Training for New Equipment",
      isNotice: false,
      content:
        "Training Department,\n\nWe recently purchased your MetalMaster X500 CNC machine and would like to arrange comprehensive training for our operators and maintenance staff. While the documentation is excellent, we believe hands-on training would ensure optimal utilization of this sophisticated equipment.\n\nWe have a team of 5 operators and 2 maintenance technicians who would need training. Could you provide information about:\n- Training duration and curriculum\n- On-site vs. remote options\n- Cost structure\n- Certification process\n- Available dates in October\n\nOur facility is located in Boston, and we'd prefer weekday sessions if possible.\n\nThank you,\nJames Wilson\nProduction Manager, Precision Engineering Co.",
      managerId: manager.id,
    },
    {
      title: "Expedited Production Request for Trade Show",
      isNotice: false,
      content:
        "Production Team,\n\nWe're participating in the International Manufacturing Expo on October 20th and need demonstration samples of our new product. We'd like to request expedited production of the following items:\n\n- 5 sets of the aluminum housing assembly (Drawing #TK-421-A)\n- 10 sets of the brass connector components (Drawing #TK-421-B)\n- 2 sets of the full-size prototype in clear SLA resin (3D model file already submitted)\n\nOur normal lead time would put delivery after the expo date. Is there any possibility of receiving these items by October 15th? We understand this may incur rush charges and are prepared for reasonable premiums.\n\nThe exposure at this major trade show represents a significant opportunity for both our companies.\n\nBest regards,\nCarla Martinez\nMarketing Director, TechKraft Industries",
      managerId: manager.id,
    },
    {
      title: "Quality Improvement Suggestion",
      isNotice: false,
      content:
        "Quality Management Team,\n\nAs a regular customer for your precision machining services, I wanted to share an observation that might help improve quality consistency.\n\nWe've noticed that parts received earlier in production runs tend to have slightly better surface finish and tighter tolerances than those delivered later in large batches. This suggests possible tool wear affecting quality over the production run.\n\nMight I suggest implementing additional in-process inspection points during longer production runs? This could help identify when tool changes are needed to maintain consistent quality throughout the batch.\n\nWe value our partnership and believe this feedback might benefit all your customers.\n\nSincerely,\nRobert Patel\nSenior Engineer, PrecisionTech Solutions",
      managerId: manager.id,
    },
    {
      title: "Custom Finishing Options for Stainless Components",
      isNotice: false,
      content:
        "Manufacturing Services Team,\n\nWe currently order stainless steel components from your CNC department with the standard machined finish. For an upcoming premium product line, we're interested in exploring additional finishing options that might be available.\n\nSpecifically, we're wondering if you offer:\n- Bead blasting for a matte appearance\n- Mirror polishing for visible surfaces\n- Passivation treatment for enhanced corrosion resistance\n- Black oxide or other decorative/functional coatings\n\nIf these services aren't available in-house, do you have preferred partners who could provide these finishes as part of a coordinated production process?\n\nThank you for the information,\nHannah Kim\nProduct Design Lead, Luxe Innovations",
      managerId: manager.id,
    },
  ];

  // Insert regular posts
  for (const post of regularPosts) {
    await prisma.post.create({
      data: post,
    });
  }

  console.log("Seed data inserted successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
