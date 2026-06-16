/* cli.c — DEEP AGENTS terminal AI agent CLI */
#include <ncurses.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <time.h>

/* ── app info ─────────────────────────────────────── */
#define APP_NAME  "DEEP AGENTS"
#define VERSION   "v0.0.1"
#define PROVIDER  "openai:gpt-5.4"
#define MCP_TOOLS 4

/* ── layout (rows) ────────────────────────────────── */
#define BANNER_H 10   /* logo 6줄 + 여백 + 상태 3줄 */
#define INPUT_H   3   /* 입력박스: 내용 1 + 테두리 2 */
#define STATUS_H  1   /* 맨 아래 상태바 */

/* 0-255 → 0-1000 (ncurses init_color 스케일) */
#define NC(x) ((int)((x) * 1000 / 255))

/* color pair 번호 */
#define CP_MINT   1
#define CP_DIM    2
#define CP_CYAN   3
#define CP_TEXT   4
#define CP_STATUS 5

/* 메시지 히스토리 */
#define IBUF_MAX 4096

typedef struct {
    char *text;
    int   is_user;   /* 1=유저, 0=어시스턴트 */
} Msg;

static Msg  *msgs    = NULL;
static int   msg_cnt = 0;
static int   msg_cap = 0;

/* 윈도우 */
static WINDOW *wban, *wchat, *winp, *wstat;

/* 입력 버퍼 */
static char  ibuf[IBUF_MAX];
static int   ilen = 0;

/* 8자리 hex 스레드 ID */
static char tid[9];

/* ── ASCII 아트 "DEEP AGENTS" (6줄) ──────────────── */
static const char *LOGO[6] = {
    " \xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x95\x97 \xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x95\x97\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x95\x97\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x95\x97     \xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x95\x97  \xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x95\x97 \xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x95\x97\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x95\x97   \xE2\x96\x88\xE2\x96\x88\xE2\x95\x97\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x95\x97\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x95\x97",
    " \xE2\x96\x88\xE2\x96\x88\xE2\x95\x94\xE2\x95\x90\xE2\x95\x90\xE2\x96\x88\xE2\x96\x88\xE2\x95\x97\xE2\x96\x88\xE2\x96\x88\xE2\x95\x94\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x9D\xE2\x96\x88\xE2\x96\x88\xE2\x95\x94\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x9D\xE2\x96\x88\xE2\x96\x88\xE2\x95\x94\xE2\x95\x90\xE2\x95\x90\xE2\x96\x88\xE2\x96\x88\xE2\x95\x97   \xE2\x96\x88\xE2\x96\x88\xE2\x95\x94\xE2\x95\x90\xE2\x95\x90\xE2\x96\x88\xE2\x96\x88\xE2\x95\x97\xE2\x96\x88\xE2\x96\x88\xE2\x95\x94\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90 \xE2\x96\x88\xE2\x96\x88\xE2\x95\x94\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x9D\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x95\x97  \xE2\x96\x88\xE2\x96\x88\xE2\x95\x91\xE2\x95\x9A\xE2\x95\x90\xE2\x95\x90\xE2\x96\x88\xE2\x96\x88\xE2\x95\x94\xE2\x95\x90\xE2\x95\x9D\xE2\x96\x88\xE2\x96\x88\xE2\x95\x94\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x9D",
    " \xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x95\x94\xE2\x95\x9D\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x95\x97  \xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x95\x97  \xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x95\x94\xE2\x95\x9D   \xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x95\x91\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x95\x97  \xE2\x96\x88\xE2\x96\x88\xE2\x95\x91 \xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x95\x97  \xE2\x96\x88\xE2\x96\x88\xE2\x95\x94\xE2\x96\x88\xE2\x96\x88\xE2\x95\x97 \xE2\x96\x88\xE2\x96\x88\xE2\x95\x91   \xE2\x96\x88\xE2\x96\x88\xE2\x95\x91   \xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x95\x97",
    " \xE2\x96\x88\xE2\x96\x88\xE2\x95\x94\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x9D \xE2\x96\x88\xE2\x96\x88\xE2\x95\x94\xE2\x95\x90\xE2\x95\x90\xE2\x95\x9D  \xE2\x96\x88\xE2\x96\x88\xE2\x95\x94\xE2\x95\x90\xE2\x95\x90\xE2\x95\x9D  \xE2\x96\x88\xE2\x96\x88\xE2\x95\x94\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90     \xE2\x96\x88\xE2\x96\x88\xE2\x95\x94\xE2\x95\x90\xE2\x95\x90\xE2\x96\x88\xE2\x96\x88\xE2\x95\x91\xE2\x96\x88\xE2\x96\x88\xE2\x95\x91   \xE2\x96\x88\xE2\x96\x88\xE2\x95\x91\xE2\x96\x88\xE2\x96\x88\xE2\x95\x94\xE2\x95\x90\xE2\x95\x90\xE2\x95\x9D  \xE2\x96\x88\xE2\x96\x88\xE2\x95\x91\xE2\x95\x9A\xE2\x96\x88\xE2\x96\x88\xE2\x95\x97\xE2\x96\x88\xE2\x96\x88\xE2\x95\x91   \xE2\x96\x88\xE2\x96\x88\xE2\x95\x91   \xE2\x95\x9A\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x96\x88\xE2\x96\x88\xE2\x95\x91",
    " \xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x95\x94\xE2\x95\x9D\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x95\x97\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x95\x97\xE2\x96\x88\xE2\x96\x88\xE2\x95\x91         \xE2\x96\x88\xE2\x96\x88\xE2\x95\x91  \xE2\x96\x88\xE2\x96\x88\xE2\x95\x91\xE2\x95\x9A\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x95\x94\xE2\x95\x9D\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x95\x91\xE2\x96\x88\xE2\x96\x88\xE2\x95\x91 \xE2\x95\x9A\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x95\x91   \xE2\x96\x88\xE2\x96\x88\xE2\x95\x91   \xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x96\x88\xE2\x95\x91",
    " \xE2\x95\x9A\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x9D \xE2\x95\x9A\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x9D\xE2\x95\x9A\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x9D\xE2\x95\x9A\xE2\x95\x90\xE2\x95\x9D         \xE2\x95\x9A\xE2\x95\x90\xE2\x95\x9D  \xE2\x95\x9A\xE2\x95\x90\xE2\x95\x9D \xE2\x95\x9A\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x9D \xE2\x95\x9A\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x9D\xE2\x95\x9A\xE2\x95\x90\xE2\x95\x9D  \xE2\x95\x9A\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x9D   \xE2\x95\x9A\xE2\x95\x90\xE2\x95\x9D   \xE2\x95\x9A\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x9D",
};

/* 마스코트 (오른쪽에 살짝) */
static const char *MASCOT[4] = {
    " \xE2\x95\xAD\xE2\x94\x80\xE2\x94\x80\xE2\x94\x80\xE2\x94\x80\xE2\x94\x80\xE2\x95\xAE",
    " \xE2\x94\x82\xE2\x97\x89   \xE2\x97\x89\xE2\x94\x82",
    " \xE2\x94\x82   \xE2\x96\xBD   \xE2\x94\x82",
    " \xE2\x95\xB0\xE2\x94\x80\xE2\x94\x80\xE2\x94\x80\xE2\x94\x80\xE2\x94\x80\xE2\x95\xAF",
};

/* ─────────────────────────────────────────────────── */

static void gen_tid(void) {
    snprintf(tid, sizeof(tid), "%04x%04x",
             rand() % 0x10000, rand() % 0x10000);
}

static void setup_colors(void) {
    start_color();
    use_default_colors();

    int bg, mint, dim, cyan, txt;

    if (can_change_color() && COLORS >= 256) {
        /* truecolor 팔레트를 슬롯 16-20 에 정의 */
        bg   = 16; mint = 17; dim = 18; cyan = 19; txt = 20;
        init_color(bg,   NC(0x0d), NC(0x0d), NC(0x0d));
        init_color(mint, NC(0x5f), NC(0xd6), NC(0xa0));
        init_color(dim,  NC(0x6b), NC(0x72), NC(0x80));
        init_color(cyan, NC(0x5f), NC(0xb4), NC(0xd6));
        init_color(txt,  NC(0xe5), NC(0xe5), NC(0xe5));
    } else {
        /* 256색 지원 안 되면 표준 색으로 폴백 */
        bg   = -1;
        mint = COLOR_GREEN;
        dim  = COLOR_WHITE;
        cyan = COLOR_CYAN;
        txt  = COLOR_WHITE;
    }

    init_pair(CP_MINT,   mint, bg);
    init_pair(CP_DIM,    dim,  bg);
    init_pair(CP_CYAN,   cyan, bg);
    init_pair(CP_TEXT,   txt,  bg);
    init_pair(CP_STATUS, bg,   mint);
}

static void make_wins(void) {
    int ch = LINES - BANNER_H - INPUT_H - STATUS_H;
    if (ch < 2) ch = 2;
    wban  = newwin(BANNER_H, COLS, 0,                         0);
    wchat = newwin(ch,       COLS, BANNER_H,                  0);
    winp  = newwin(INPUT_H,  COLS, BANNER_H + ch,             0);
    wstat = newwin(STATUS_H, COLS, BANNER_H + ch + INPUT_H,   0);
    scrollok(wchat, TRUE);
    keypad(winp, TRUE);
}

static void del_wins(void) {
    delwin(wban); delwin(wchat); delwin(winp); delwin(wstat);
}

static void draw_banner(void) {
    int r;
    werase(wban);

    /* ASCII 아트 로고 */
    wattron(wban, COLOR_PAIR(CP_MINT) | A_BOLD);
    for (r = 0; r < 6; r++)
        mvwprintw(wban, r, 0, "%s", LOGO[r]);
    wattroff(wban, COLOR_PAIR(CP_MINT) | A_BOLD);

    /* 마스코트 (오른쪽) */
    int mc = COLS - 9;
    if (mc > 0) {
        wattron(wban, COLOR_PAIR(CP_DIM));
        for (r = 1; r < 5; r++)
            mvwprintw(wban, r, mc, "%s", MASCOT[r - 1]);
        wattroff(wban, COLOR_PAIR(CP_DIM));
    }

    /* 버전 */
    int vlen = (int)strlen(VERSION);
    if (COLS - vlen - 12 > 0) {
        wattron(wban, COLOR_PAIR(CP_MINT));
        mvwprintw(wban, 0, COLS - vlen - 2, "%s", VERSION);
        wattroff(wban, COLOR_PAIR(CP_MINT));
    }

    /* 상태 줄 1 */
    r = 7;
    wattron(wban, COLOR_PAIR(CP_MINT));
    mvwprintw(wban, r, 1, "\xE2\x9C\x93");   /* ✓ */
    wattroff(wban, COLOR_PAIR(CP_MINT));
    wattron(wban, COLOR_PAIR(CP_TEXT));
    wprintw(wban, " LangSmith tracing: 'agent-cli'   ");
    wattroff(wban, COLOR_PAIR(CP_TEXT));
    wattron(wban, COLOR_PAIR(CP_DIM));
    wprintw(wban, "Thread: %s   ", tid);
    wattroff(wban, COLOR_PAIR(CP_DIM));
    wattron(wban, COLOR_PAIR(CP_MINT));
    wprintw(wban, "\xE2\x9C\x93");
    wattroff(wban, COLOR_PAIR(CP_MINT));
    wattron(wban, COLOR_PAIR(CP_TEXT));
    wprintw(wban, " Loaded %d MCP tools", MCP_TOOLS);
    wattroff(wban, COLOR_PAIR(CP_TEXT));

    /* 상태 줄 2 */
    r = 8;
    wattron(wban, COLOR_PAIR(CP_MINT) | A_BOLD);
    mvwprintw(wban, r, 1, "Ready to code! What would you like to build?");
    wattroff(wban, COLOR_PAIR(CP_MINT) | A_BOLD);

    /* 힌트 줄 */
    r = 9;
    wattron(wban, COLOR_PAIR(CP_DIM));
    mvwprintw(wban, r, 1,
              "  Enter send  \xE2\x80\xA2  Ctrl+J newline  \xE2\x80\xA2  @ files  \xE2\x80\xA2  / commands");
    wattroff(wban, COLOR_PAIR(CP_DIM));

    wrefresh(wban);
}

static void draw_status(void) {
    werase(wstat);
    wattron(wstat, COLOR_PAIR(CP_STATUS) | A_BOLD);
    mvwhline(wstat, 0, 0, ' ', COLS);
    mvwprintw(wstat, 0, 1, " %s  |  %s  |  thread: %s",
              APP_NAME, PROVIDER, tid);
    wattroff(wstat, COLOR_PAIR(CP_STATUS) | A_BOLD);
    wrefresh(wstat);
}

static void draw_input(void) {
    werase(winp);

    /* 시안 테두리 */
    wattron(winp, COLOR_PAIR(CP_CYAN));
    box(winp, 0, 0);
    wattroff(winp, COLOR_PAIR(CP_CYAN));

    /* "> " 프롬프트 */
    wattron(winp, COLOR_PAIR(CP_CYAN) | A_BOLD);
    mvwprintw(winp, 1, 1, "> ");
    wattroff(winp, COLOR_PAIR(CP_CYAN) | A_BOLD);

    /* 입력 텍스트 (너무 길면 끝부분 보여줌) */
    int max_show = COLS - 5;
    if (max_show < 1) max_show = 1;
    int start = (ilen > max_show) ? ilen - max_show : 0;
    wattron(winp, COLOR_PAIR(CP_TEXT));
    mvwprintw(winp, 1, 3, "%.*s", max_show, ibuf + start);
    wattroff(winp, COLOR_PAIR(CP_TEXT));

    /* 커서 위치 */
    int cx = 3 + (ilen - start);
    if (cx >= COLS - 1) cx = COLS - 2;
    wmove(winp, 1, cx);
    wrefresh(winp);
}

/* 채팅창에 메시지 한 개 추가 */
static void chat_append(const char *text, int is_user) {
    if (is_user) {
        wattron(wchat, COLOR_PAIR(CP_CYAN) | A_BOLD);
        waddstr(wchat, "\n \xE2\x94\x82 ");   /* │ */
        wattroff(wchat, COLOR_PAIR(CP_CYAN) | A_BOLD);
        wattron(wchat, COLOR_PAIR(CP_MINT) | A_BOLD);
        waddstr(wchat, "> ");
        wattroff(wchat, COLOR_PAIR(CP_MINT) | A_BOLD);
        wattron(wchat, COLOR_PAIR(CP_TEXT));
        waddstr(wchat, text);
        wattroff(wchat, COLOR_PAIR(CP_TEXT));
    } else {
        wattron(wchat, COLOR_PAIR(CP_DIM));
        waddstr(wchat, "\n   ");
        wattroff(wchat, COLOR_PAIR(CP_DIM));
        wattron(wchat, COLOR_PAIR(CP_TEXT));
        waddstr(wchat, text);
        wattroff(wchat, COLOR_PAIR(CP_TEXT));
    }
    waddch(wchat, '\n');
    wrefresh(wchat);
}

/* 메시지 히스토리에 추가 + 화면 렌더 */
static void add_msg(const char *text, int is_user) {
    if (msg_cnt >= msg_cap) {
        msg_cap = msg_cap ? msg_cap * 2 : 16;
        msgs = realloc(msgs, msg_cap * sizeof(Msg));
    }
    msgs[msg_cnt].text    = strdup(text);
    msgs[msg_cnt].is_user = is_user;
    msg_cnt++;
    chat_append(text, is_user);
}

/* 리사이즈 후 채팅 히스토리 재출력 */
static void redraw_chat(void) {
    int i;
    werase(wchat);
    for (i = 0; i < msg_cnt; i++)
        chat_append(msgs[i].text, msgs[i].is_user);
}

/* 터미널 크기 바뀌면 전부 다시 그림 */
static void do_resize(void) {
    endwin();
    refresh();
    clear();
    del_wins();
    make_wins();
    draw_banner();
    redraw_chat();
    draw_status();
    draw_input();
}

int main(void) {
    int i, ch;

    srand((unsigned)time(NULL));
    gen_tid();

    initscr();
    raw();       /* raw 모드: Enter='\r', Ctrl+J='\n' 구분 가능 */
    noecho();
    curs_set(1);

    setup_colors();
    make_wins();
    draw_banner();
    draw_status();
    draw_input();

    /* 메인 루프 */
    while (1) {
        ch = wgetch(winp);

        /* 터미널 리사이즈 */
        if (ch == KEY_RESIZE) { do_resize(); continue; }

        /* Ctrl+C (3) 또는 Ctrl+Q (17) 로 종료 */
        if (ch == 3 || ch == 17) break;

        if (ch == '\r') {
            /* Enter → 전송 */
            if (ilen > 0) {
                ibuf[ilen] = '\0';
                add_msg(ibuf, 1);

                /* TODO: 실제 API 호출로 바꾸기 */
                char resp[IBUF_MAX + 80];
                snprintf(resp, sizeof(resp),
                         "[%s]  \"%.*s\" 수신됨.", PROVIDER, 60, ibuf);
                add_msg(resp, 0);

                ilen = 0;
            }
        } else if (ch == '\n') {
            /* Ctrl+J → 줄바꿈 삽입 */
            if (ilen < IBUF_MAX - 1) ibuf[ilen++] = '\n';
        } else if (ch == KEY_BACKSPACE || ch == 127 || ch == '\b') {
            if (ilen > 0) ilen--;
        } else if (ch >= 32 && ch < 127) {
            if (ilen < IBUF_MAX - 1) ibuf[ilen++] = (char)ch;
        }

        draw_input();
    }

    /* 정리 */
    for (i = 0; i < msg_cnt; i++) free(msgs[i].text);
    free(msgs);
    del_wins();
    endwin();
    return 0;
}
