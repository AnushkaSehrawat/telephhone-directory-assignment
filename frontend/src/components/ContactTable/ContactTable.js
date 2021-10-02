import React from "react";
import { Link } from "react-router-dom";
import Moment from "moment";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";

import "./ContactTable.css";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {},
  container: {
    maxHeight: 1050,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper2: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
  },
}));

export default function ContactTable(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState(null);
  const [orderBy, setOrderBy] = React.useState("");

  const handleRequestSort = (event, property) => {
    let sortOrder = null;
    if (order) {
      const isAsc = order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      sortOrder = isAsc ? "desc" : "asc";
    } else {
      sortOrder = "asc";
      setOrder("asc");
    }
    setOrderBy(property);
    props.onChangeSort(property, sortOrder);
  };

  return (
    <div>
      <Paper className={classes.paper}>
        <TableContainer className={classes.container}>
          <Table
            stickyHeader
            className={classes.table}
            style={{ width: "100%" }}
          >
            <TableHead>
              <TableRow>
                {props.headcells.map((obj) => {
                  return (
                    <TableCell
                      key={obj.id}
                      sortDirection={orderBy == obj.name ? order : false}
                    >
                      <TableSortLabel
                        className="table-heading"
                        active={true}
                        direction={orderBy === obj.name ? order : "asc"}
                        onClick={() => handleRequestSort(null, obj.name)}
                      >
                        <div>{obj.label}</div>
                        <span className={classes.visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </span>
                      </TableSortLabel>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {props.rows.map((row) => {
                return (
                  <TableRow>
                    {props.headcells.map((headcell) => {
                      if (row[headcell.name]) {
                        return (
                          <TableCell>
                            {headcell.name == "first_name" ? (
                              <Link to={"/contact/" + row["id"]}>
                                {row[headcell.name]}
                              </Link>
                            ) : headcell.name == "created_at" ? (
                              <span>
                                {new Date(
                                  row[headcell.name] * 1000
                                ).getUTCDate() +
                                  "-" +
                                  new Date(
                                    row[headcell.name] * 1000
                                  ).getMonth() +
                                  "-" +
                                  new Date(
                                    row[headcell.name] * 1000
                                  ).getFullYear()}
                              </span>
                            ) : (
                              row[headcell.name]
                            )}
                          </TableCell>
                        );
                      } else {
                        return <TableCell>{null}</TableCell>;
                      }
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
