import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "react-js-pagination";
import "../../css/boardList.css";
import "../../css/page.css";

function BoardList() {
  const [boardList, setBoardList] = useState([]);

  // 검색용 Hook
  const [choiceVal, setChoiceVal] = useState("");
  const [searchVal, setSearchVal] = useState("");

  // Paging
  const [page, setPage] = useState(1);
  const [totalCnt, setTotalCnt] = useState(0);

  // Link 용 (함수)
  let navigate = useNavigate();

  /* [GET /Board]: 게시글 목록 */
  const getBoardList = async (choice, search, page) => {
    await axios
      .get("http://localhost:8080/board", {
        params: { choice: choice, search: search, page: page },
      })
      .then((response) => {
        console.log("[BoardList.js] useEffect() success :D");
        console.log(response.data);

        setBoardList(response.data.boardList);
        setTotalCnt(response.data.pageCnt);
      })
      .catch((err) => {
        console.log("[BoardList.js] useEffect() error :<");
        console.log(err);
      });
  };

  useEffect(() => {
    getBoardList("", "", 1);
  }, []);

  const changeChoice = (event) => {
    setChoiceVal(event.target.value);
  };
  const changeSearch = (event) => {
    setSearchVal(event.target.value);
  };
  const search = () => {
    console.log(
      "[BoardList.js searchBtn()] choiceVal=" +
        choiceVal +
        ", searchVal=" +
        searchVal
    );

    navigate("/boardList");
    getBoardList(choiceVal, searchVal, 1);
  };

  const changePage = (page) => {
    setPage(page);
    getBoardList(choiceVal, searchVal, page);
  };

  return (
    <div>
      {/* 검색 */}
      <table className="search">
        <tbody>
          <tr>
            <td>
              <select
                className="custom-select"
                value={choiceVal}
                onChange={changeChoice}
              >
                <option>검색 옵션 선택</option>
                <option value="title">제목</option>
                <option value="content">내용</option>
                <option value="writer">작성자</option>
              </select>
            </td>
            <td>
              <input
                type="text"
                className="form-control"
                placeholder="검색어"
                value={searchVal}
                onChange={changeSearch}
              />
            </td>
            <td>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={search}
              >
                <i className="fas fa-search"></i> 검색
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <br />

      <table className="table table-hover">
        <thead>
          <tr>
            <th className="col-1">번호</th>
            <th className="col-8">제목</th>
            <th className="col-3">작성자</th>
          </tr>
        </thead>

        <tbody>
          {boardList.map(function (board, idx) {
            return <TableRow obj={board} key={idx} cnt={idx + 1} />;
          })}
        </tbody>
      </table>

      <Pagination
        className="pagination"
        activePage={page}
        itemsCountPerPage={10}
        totalItemsCount={totalCnt}
        pageRangeDisplayed={5}
        prevPageText={"‹"}
        nextPageText={"›"}
        onChange={changePage}
      />

      <div className="my-5 d-flex justify-content-center">
        <Link className="btn btn-outline-secondary" to="/Boardwrite">
          <i className="fas fa-pen"></i> &nbsp; 글쓰기
        </Link>
      </div>
    </div>
  );
}

/* 글 목록 테이블 행 컴포넌트 */
function TableRow(props) {
  const board = props.obj;

  return (
    <tr>
      <th>{props.cnt}</th>
      {board.del == 0 ? (
        // 삭제되지 않은 게시글
        <>
          <td>
            <Arrow depth={board.depth}></Arrow> &nbsp; {/* 답글 화살표 */}
            <Link to={{ pathname: `/boardDetail/${board.seq}` }}>
              {" "}
              {/* 게시글 상세 링크 */}
              <span className="underline board-title">{board.title} </span>{" "}
              {/* 게시글 제목 */}
            </Link>
          </td>
          <td>{board.id}</td>
        </>
      ) : (
        // 삭제된 게시글
        <>
          <td>
            <Arrow depth={board.depth}></Arrow> &nbsp; {/* 답글 화살표 */}
            <span className="del-span">
              ⚠️ 이 글은 작성자에 의해 삭제됐습니다.
            </span>
          </td>
        </>
      )}
    </tr>
  );
}

const tap = "\u00A0\u00A0\u00A0\u00A0";
function Arrow(props) {
  const depth = props.depth;

  if (depth === 0) {
    return null;
  }

  const taps = [];
  for (let i = 0; i < depth; i++) {
    taps.push(tap);
  }

  return (
    <>
      {taps} <i className="fas fa-long-arrow-alt-right"></i>
    </>
  );
}

export default BoardList;
