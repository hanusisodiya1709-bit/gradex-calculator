#!/usr/bin/env python3
"""
==============================================================
  GRADEX  |  Student Grade Calculator using Python
  Internship Project - JECRC Foundation
==============================================================
  Pipeline:  Input (Marks) -> Calculation -> Grade -> Result

  Concepts demonstrated:
    * input / output          * functions
    * loops                   * conditions (if / elif / else)
    * lists & dictionaries    * exception handling (try / except)
    * file handling (CSV)     * modular, readable code

  Runs on any machine with Python 3.8+ (no external libraries)
==============================================================
"""

import csv
import os
import sys
import time
from datetime import datetime

# --------------------------------------------------------------
#  CONFIGURATION
# --------------------------------------------------------------
SUBJECTS = ["Python Programming", "Mathematics", "English", "Physics", "Computer Science"]
MAX_MARKS = 100          # maximum marks per subject
PASS_MARKS = 40          # minimum marks needed in EACH subject
WIDTH = 64               # width of the result card

records = []             # students evaluated in this session


# --------------------------------------------------------------
#  TERMINAL STYLING (CROSS-PLATFORM ANSI)
# --------------------------------------------------------------
class C:
    RESET = "\033[0m"
    BOLD = "\033[1m"
    DIM = "\033[2m"
    RED = "\033[91m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    BLUE = "\033[94m"
    MAGENTA = "\033[95m"
    CYAN = "\033[96m"
    WHITE = "\033[97m"


if os.name == "nt":      # enables ANSI colors on Windows terminals
    try:
        os.system("")
    except Exception:
        pass


def clear():
    try:
        os.system("cls" if os.name == "nt" else "clear")
    except Exception:
        print("\n" * 20)


def typewriter(text, delay=0.010, color=C.WHITE):
    """Prints text one character at a time for smooth presentation."""
    for ch in text:
        sys.stdout.write(f"{color}{ch}{C.RESET}")
        sys.stdout.flush()
        time.sleep(delay)
    print()


def loading(message, steps=20, delay=0.02):
    """Animated progress bar."""
    for i in range(steps + 1):
        filled = "█" * i
        empty = "░" * (steps - i)
        pct = int(i / steps * 100)
        sys.stdout.write(f"\r  {C.CYAN}{message} {C.BLUE}[{filled}{empty}] {C.WHITE}{pct:3d}%{C.RESET}")
        sys.stdout.flush()
        time.sleep(delay)
    print()


def banner():
    clear()
    art = r"""
   ██████╗ ██████╗  █████╗ ██████╗ ███████╗██╗  ██╗
  ██╔════╝ ██╔══██╗██╔══██╗██╔══██╗██╔════╝╚██╗██╔╝
  ██║  ███╗██████╔╝███████║██║  ██║█████╗   ╚███╔╝ 
  ██║   ██║██╔══██╗██╔══██║██║  ██║██╔══╝   ██╔██╗ 
  ╚██████╔╝██║  ██║██║  ██║██████╔╝███████╗██╔╝ ██╗
   ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝╚═╝  ╚═╝
"""
    colors = [C.CYAN, C.CYAN, C.BLUE, C.BLUE, C.MAGENTA, C.MAGENTA]
    for line, col in zip(art.strip("\n").split("\n"), colors):
        print(f"{C.BOLD}{col}{line}{C.RESET}")
    print(f"\n  {C.BOLD}{C.WHITE}STUDENT GRADE CALCULATOR{C.RESET}  {C.DIM}|  Built with Python{C.RESET}")
    print(f"  {C.DIM}JECRC Foundation  •  Internship Project Demonstration{C.RESET}")
    print(f"  {C.BLUE}{'━' * (WIDTH - 2)}{C.RESET}")
    flow = ["1. Input (Marks)", "2. Calculation", "3. Grade", "4. Result"]
    print("  " + f" {C.YELLOW}➜{C.RESET} ".join(f"{C.BOLD}{C.CYAN}{s}{C.RESET}" for s in flow))
    print(f"  {C.BLUE}{'━' * (WIDTH - 2)}{C.RESET}\n")


# --------------------------------------------------------------
#  STEP 1 : INPUT  (accept student marks)
# --------------------------------------------------------------
def ask_text(prompt, upper=False):
    while True:
        value = input(f"  {C.CYAN}{prompt:<18}:{C.RESET} ").strip()
        if value:
            return value.upper() if upper else value.title()
        print(f"  {C.RED}✖ Field cannot be empty.{C.RESET}")


def ask_marks(subject):
    """Validates numeric marks between 0 and MAX_MARKS."""
    while True:
        try:
            raw = input(f"  {C.YELLOW}▸{C.RESET} {subject:<20} (0-{MAX_MARKS}): ").strip()
            marks = float(raw)
            if 0 <= marks <= MAX_MARKS:
                return marks
            print(f"    {C.RED}✖ Marks must be between 0 and {MAX_MARKS}.{C.RESET}")
        except ValueError:
            print(f"    {C.RED}✖ Please enter a valid numeric value.{C.RESET}")


def accept_student_marks():
    print(f"  {C.BOLD}{C.MAGENTA}STEP 1  ➜  ACCEPT STUDENT DETAILS & MARKS{C.RESET}\n")
    name = ask_text("Student Name")
    roll = ask_text("Roll Number", upper=True)
    print(f"\n  {C.DIM}Enter subject marks (Pass Mark = {PASS_MARKS}/{MAX_MARKS}):{C.RESET}\n")
    marks = {subject: ask_marks(subject) for subject in SUBJECTS}
    return name, roll, marks


# --------------------------------------------------------------
#  STEP 2 : CALCULATION  (total / percentage / GPA)
# --------------------------------------------------------------
def calculate(marks):
    total = sum(marks.values())
    maximum = MAX_MARKS * len(marks)
    percentage = (total / maximum) * 100
    gpa = (percentage / 9.5) if percentage > 0 else 0.0  # Standard 10-point scale conversion
    return total, maximum, percentage, round(gpa, 2)


# --------------------------------------------------------------
#  STEP 3 : GRADE  (determine grade using conditions)
# --------------------------------------------------------------
def determine_grade(percentage):
    if percentage >= 90:
        return "A+", "Outstanding (Distinction)", C.GREEN
    elif percentage >= 80:
        return "A", "Excellent (First Class)", C.GREEN
    elif percentage >= 70:
        return "B", "Very Good", C.CYAN
    elif percentage >= 60:
        return "C", "Good", C.CYAN
    elif percentage >= 50:
        return "D", "Satisfactory", C.YELLOW
    elif percentage >= PASS_MARKS:
        return "E", "Needs Improvement", C.YELLOW
    else:
        return "F", "Fail", C.RED


def check_pass(marks):
    """A student passes only if every subject meets the pass mark (40)."""
    failed = [s for s, m in marks.items() if m < PASS_MARKS]
    return len(failed) == 0, failed


# --------------------------------------------------------------
#  STEP 4 : RESULT  (display final result)
# --------------------------------------------------------------
def bar(value, width=20):
    filled = round(value / MAX_MARKS * width)
    color = C.GREEN if value >= 75 else C.YELLOW if value >= PASS_MARKS else C.RED
    return f"{color}{'█' * filled}{C.DIM}{'░' * (width - filled)}{C.RESET}"


def row(plain, colored=None):
    """Prints one card row with proper box border alignment."""
    colored = colored if colored is not None else plain
    pad = WIDTH - 4 - len(plain)
    print(f"  {C.BLUE}┃{C.RESET} {colored}{' ' * max(pad, 0)} {C.BLUE}┃{C.RESET}")


def display_result(name, roll, marks, total, maximum, percentage, gpa, grade, remark, gcolor, passed, failed):
    print(f"\n  {C.BOLD}{C.MAGENTA}STEP 4  ➜  FINAL RESULT & MARKSHEET{C.RESET}\n")
    print(f"  {C.BLUE}┏{'━' * (WIDTH - 2)}┓{C.RESET}")
    title = "JECRC FOUNDATION - ACADEMIC REPORT CARD"
    row(title.center(WIDTH - 4), f"{C.BOLD}{C.WHITE}{title.center(WIDTH - 4)}{C.RESET}")
    print(f"  {C.BLUE}┣{'━' * (WIDTH - 2)}┫{C.RESET}")
    row(f"Student : {name}", f"{C.DIM}Student :{C.RESET} {C.BOLD}{name}{C.RESET}")
    row(f"Roll No : {roll}", f"{C.DIM}Roll No :{C.RESET} {C.BOLD}{roll}{C.RESET}")
    row(f"Date    : {datetime.now():%d %b %Y, %I:%M %p}",
        f"{C.DIM}Date    :{C.RESET} {datetime.now():%d %b %Y, %I:%M %p}")
    print(f"  {C.BLUE}┣{'━' * (WIDTH - 2)}┫{C.RESET}")

    for subject, m in marks.items():
        status_tag = "[PASS]" if m >= PASS_MARKS else "[FAIL]"
        plain = f"{subject:<20} {m:6.1f}/{MAX_MARKS}  " + "#" * 20
        colored = f"{subject:<20} {m:6.1f}/{MAX_MARKS}  {bar(m)}"
        row(plain, colored)

    print(f"  {C.BLUE}┣{'━' * (WIDTH - 2)}┫{C.RESET}")
    row(f"Total Marks: {total:.1f} / {maximum}",
        f"{C.DIM}Total Marks:{C.RESET} {C.BOLD}{total:.1f} / {maximum}{C.RESET}")
    row(f"Percentage : {percentage:.2f}%",
        f"{C.DIM}Percentage :{C.RESET} {C.BOLD}{percentage:.2f}%{C.RESET}")
    row(f"Approx GPA : {gpa:.2f} / 10.0",
        f"{C.DIM}Approx GPA :{C.RESET} {C.BOLD}{gpa:.2f} / 10.0{C.RESET}")
    row(f"Grade      : {grade}  ({remark})",
        f"{C.DIM}Grade      :{C.RESET} {C.BOLD}{gcolor}{grade}{C.RESET}  {gcolor}({remark}){C.RESET}")

    status = "PASS" if passed else "FAIL"
    icon = "✔" if passed else "✖"
    scolor = C.GREEN if passed else C.RED
    row(f"Status     : {icon} {status}",
        f"{C.DIM}Status     :{C.RESET} {C.BOLD}{scolor}{icon} {status}{C.RESET}")

    if failed:
        row(f"Backlog Sub: {', '.join(failed)}"[:WIDTH - 4],
            f"{C.DIM}Backlog Sub:{C.RESET} {C.RED}{', '.join(failed)}{C.RESET}"[:WIDTH + 20])
    print(f"  {C.BLUE}┗{'━' * (WIDTH - 2)}┛{C.RESET}")

    if passed and percentage >= 90:
        typewriter("\n  🏆  Distinction performance! Excellent academic grasp.", color=C.GREEN)
    elif passed:
        typewriter("\n  🎉  Passed successfully! Well done.", color=C.GREEN)
    else:
        typewriter("\n  ⚠️  Student failed due to score(s) under 40. Eligible for re-examination.", color=C.RED)


# --------------------------------------------------------------
#  SESSION LEADERBOARD & CSV EXPORT
# --------------------------------------------------------------
def show_leaderboard():
    banner()
    print(f"  {C.BOLD}{C.MAGENTA}🏆  SESSION LEADERBOARD{C.RESET}\n")
    if not records:
        print(f"  {C.YELLOW}No students evaluated in this session yet. Evaluate one first!{C.RESET}")
        return
    ranked = sorted(records, key=lambda r: r["percentage"], reverse=True)
    print(f"  {C.BOLD}{'Rank':<6}{'Name':<20}{'Roll':<12}{'%':>8}  {'Grade':<6} Status{C.RESET}")
    print(f"  {C.BLUE}{'─' * 60}{C.RESET}")
    medals = {1: "🥇", 2: "🥈", 3: "🥉"}
    for i, r in enumerate(ranked, start=1):
        medal = medals.get(i, f"{i:>2}")
        print(f"  {medal:<5} {r['name']:<20}{r['roll']:<12}{r['percentage']:>7.2f}%  "
              f"{r['gcolor']}{C.BOLD}{r['grade']:<6}{C.RESET} {r['status']}")


def export_csv():
    if not records:
        print(f"\n  {C.YELLOW}No records to export yet. Please evaluate a student first.{C.RESET}")
        return
    filename = f"jecrc_grade_report_{datetime.now():%Y%m%d_%H%M%S}.csv"
    try:
        with open(filename, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["Student Name", "Roll Number"] + SUBJECTS + ["Total", "Max", "Percentage", "Grade", "Status"])
            for r in records:
                writer.writerow([r["name"], r["roll"]] + list(r["marks"].values()) +
                                [r["total"], r["maximum"], f"{r['percentage']:.2f}", r["grade"], r["status"]])
        loading("Exporting CSV report", steps=16)
        print(f"\n  {C.GREEN}✔ Successfully saved report to {C.BOLD}{filename}{C.RESET}")
    except OSError as err:
        print(f"\n  {C.RED}✖ Error saving file: {err}{C.RESET}")


def load_demo_student(name, roll, marks):
    """Loads a pre-set student for quick viva presentation demonstration."""
    total, maximum, percentage, gpa = calculate(marks)
    grade, remark, gcolor = determine_grade(percentage)
    passed, failed = check_pass(marks)
    if not passed and grade != "F":
        grade, remark, gcolor = "F", "Fail (Subject backlog below 40)", C.RED

    record = {
        "name": name, "roll": roll, "marks": marks, "total": total,
        "maximum": maximum, "percentage": percentage, "gpa": gpa,
        "grade": grade, "remark": remark, "gcolor": gcolor,
        "passed": passed, "failed": failed,
        "status": "PASS" if passed else "FAIL",
    }
    records.append(record)
    return record


# --------------------------------------------------------------
#  MAIN FLOW & MENU
# --------------------------------------------------------------
def evaluate_student():
    banner()
    name, roll, marks = accept_student_marks()

    print()
    loading("Calculating total & percentage")
    total, maximum, percentage, gpa = calculate(marks)

    loading("Determining grade conditions  ")
    grade, remark, gcolor = determine_grade(percentage)
    passed, failed = check_pass(marks)
    if not passed and grade != "F":
        grade, remark, gcolor = "F", "Fail (marks < 40 in one or more subjects)", C.RED

    display_result(name, roll, marks, total, maximum, percentage, gpa,
                   grade, remark, gcolor, passed, failed)

    records.append({
        "name": name, "roll": roll, "marks": marks, "total": total,
        "maximum": maximum, "percentage": percentage, "gpa": gpa,
        "grade": grade, "remark": remark, "gcolor": gcolor,
        "passed": passed, "failed": failed,
        "status": "PASS" if passed else "FAIL",
    })


def quick_demo_loader():
    """Populates 3 demo students instantly for quick presentations."""
    load_demo_student("Aarav Sharma", "21JECRC042", {
        "Python Programming": 96.0, "Mathematics": 92.0, "English": 88.0, "Physics": 91.0, "Computer Science": 95.0
    })
    load_demo_student("Priya Verma", "21JECRC118", {
        "Python Programming": 72.0, "Mathematics": 65.0, "English": 70.0, "Physics": 58.0, "Computer Science": 75.0
    })
    load_demo_student("Rohan Gupta", "21JECRC089", {
        "Python Programming": 85.0, "Mathematics": 32.0, "English": 74.0, "Physics": 68.0, "Computer Science": 80.0
    })
    print(f"\n  {C.GREEN}✔ Loaded 3 presentation sample records (Topper, Average, Backlog).{C.RESET}")
    print(f"  {C.CYAN}Check option [2] to see the leaderboard!{C.RESET}")


def menu():
    print(f"\n  {C.BLUE}{'━' * (WIDTH - 2)}{C.RESET}")
    print(f"  {C.BOLD}{C.WHITE}GRADEX - PROJECT MENU{C.RESET}")
    print(f"   {C.CYAN}[1]{C.RESET} Evaluate a Student (Manual Input)")
    print(f"   {C.CYAN}[2]{C.RESET} View Session Leaderboard")
    print(f"   {C.CYAN}[3]{C.RESET} Export Session Results to CSV")
    print(f"   {C.CYAN}[4]{C.RESET} Load Quick Demo Students (For Presentation)")
    print(f"   {C.CYAN}[5]{C.RESET} Exit")
    return input(f"\n  {C.YELLOW}Select an option [1-5] ➜ {C.RESET}").strip()


def main():
    banner()
    typewriter("  Welcome to GRADEX: Student Grade Calculator System.", color=C.CYAN)
    print(f"  {C.DIM}Ready for project demonstration & viva evaluation.{C.RESET}")
    time.sleep(0.3)

    while True:
        choice = menu()
        if choice == "1":
            evaluate_student()
        elif choice == "2":
            show_leaderboard()
        elif choice == "3":
            export_csv()
        elif choice == "4":
            quick_demo_loader()
        elif choice == "5":
            print()
            typewriter("  Demonstration completed. Thank you! 🚀", color=C.MAGENTA)
            break
        else:
            print(f"\n  {C.RED}✖ Invalid selection. Please choose 1 to 5.{C.RESET}")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n\n  {C.YELLOW}Session aborted. Goodbye!{C.RESET}")
