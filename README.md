# FFCS Planner

A comprehensive course planning tool for VIT University's Fully Flexible Credit System (FFCS). This Next.js application helps students plan their academic schedules, manage course selections, and optimize their timetables.

## Features

- **Course Selection**: Browse and select from available courses
- **Timetable Generation**: Automatically generate conflict-free timetables
- **Credit Management**: Track credit requirements and course loads
- **Schedule Optimization**: Find the best possible schedule combinations
- **Export Options**: Export timetables in various formats
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context/Hooks
- **Data Storage**: Local Storage / IndexedDB
- **Build Tool**: Webpack (via Next.js)

## Project Structure

```
ffcs-planner/
├── app/                    # Next.js App Router pages
├── components/             # Reusable React components
├── lib/                    # Utility functions and helpers
├── public/                 # Static assets
├── types/                  # TypeScript type definitions
└── data/                   # Course data and mock files
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ffcs-planner.git
cd ffcs-planner
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Copy environment variables:

```bash
cp .env.example .env.local
```

## Usage

### For Students:

1. **Browse Courses**: View available courses by category, department, or semester
2. **Add to Cart**: Select courses you're interested in
3. **Generate Timetable**: Let the system create conflict-free schedule combinations
4. **Review Options**: Compare different schedule possibilities
5. **Export**: Download your finalized timetable

### For Developers:

- The application uses mock data stored in `/data` folder
- Course conflicts are resolved using a constraint satisfaction algorithm
- Timetable generation supports multiple optimization criteria (minimal gaps, preferred time slots, etc.)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## API Reference

The application includes several key modules:

### Course Data Structure

```typescript
interface Course {
  code: string; // Course code (e.g., "CSE101")
  title: string; // Course title
  credits: number; // Credit value
  slots: string[]; // Time slots (e.g., ["A1", "B1"])
  instructor: string; // Faculty name
  venue: string; // Classroom/Lab
  type: "theory" | "lab" | "project";
}
```

### Timetable Generation

The system uses a constraint satisfaction algorithm to generate valid timetables:

- Prevents slot conflicts
- Ensures credit requirements are met
- Optimizes for user preferences (optional)

## Known Issues

- Large course datasets may cause performance issues
- Export functionality limited to Image
- Mobile responsive design needs improvement for tablets

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- VIT University for the FFCS system
- Next.js team for the excellent framework
- Contributors and beta testers
- Open source community

### Special Thanks

This project was inspired by the great work of:

- **Sarvesh Dakhore** - [@sarveshdakhore](https://github.com/sarveshdakhore)
- **Vatsal Joshi** (Initial work) - [@vatz88](https://github.com/vatz88)

## Support

For support and questions:

- Open an issue on GitHub
- Email: mallidipraveenkumarreddy@gmail.com
- Documentation: [Wiki](https://infinite-coder.notion.site/)

---

Made with ❤️ for VIT students
