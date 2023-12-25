import {
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

// Custom components
import { DeleteIcon, DownloadIcon, EditIcon, SearchIcon, ViewIcon } from "@chakra-ui/icons";
import Card from "components/card/Card";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import Pagination from "components/pagination/Pagination";
import Spinner from "components/spinner/Spinner";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { getApi } from "services/api";
import Delete from "../Delete";
import AddEmailHistory from "views/admin/emailHistory/components/AddEmail";
import AddPhoneCall from "views/admin/phoneCall/components/AddPhoneCall";
import Add from "../Add";
import { AddIcon } from "@chakra-ui/icons";
import { CiMenuKebab } from "react-icons/ci";

export default function CheckTable(props) {
  const { columnsData, tableData, fetchData, isLoding, allData, setSearchedData, setDisplaySearchData } = props;
  const textColor = useColorModeValue("gray.500", "white");
  // const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const columns = useMemo(() => columnsData, [columnsData]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [gopageValue, setGopageValue] = useState()
  const [deleteModel, setDelete] = useState(false);
  const [addEmailHistory, setAddEmailHistory] = useState(false);
  const [addPhoneCall, setAddPhoneCall] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [callSelectedId, setCallSelectedId] = useState();
  const navigate = useNavigate();
  const data = useMemo(() => tableData, [tableData]);
  const user = JSON.parse(localStorage.getItem("user"))
  const { isOpen, onOpen, onClose } = useDisclosure()


  const tableInstance = useTable(
    {
      columns, data,
      initialState: { pageIndex: 0 }
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = tableInstance;


  if (pageOptions.length < gopageValue) {
    setGopageValue(pageOptions.length)
  }

  const handleCheckboxChange = (event, value) => {
    if (event.target.checked) {
      setSelectedValues((prevSelectedValues) => [...prevSelectedValues, value]);
    } else {
      setSelectedValues((prevSelectedValues) =>
        prevSelectedValues.filter((selectedValue) => selectedValue !== value)
      );
    }
  };
  const handleClick = () => {
    onOpen()
  }
  const size = "lg";
  useEffect(() => {
    if (fetchData) fetchData()
  }, [deleteModel, props.isOpen])

  return (
    <>    <Card
      direction="column"
      w="100%"
      overflowX={{ sm: "scroll", lg: "hidden" }}
    >
      {/* <Flex px="25px" justify="space-between" mb="20px" align="center"> */}
      <Grid templateColumns="repeat(12, 1fr)" mb={3} gap={4}>
        <GridItem colSpan={8} >
          <Flex alignItems={"center"} flexWrap={"wrap"}>
            <Text
              color={"secondaryGray.900"}
              fontSize="22px"
              fontWeight="700"
            >
              Leads  (<CountUpComponent targetNumber={data?.length} />)
            </Text>
            <InputGroup width={"30%"} mx={3}>
              <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon color="gray.300" borderRadius="16px" />}
              />
              <Input type="text"
                fontSize='sm'
                onChange={(e) => {
                  const results = allData.filter((item) => {
                    // Iterate through each property of the object
                    for (const key in item) {
                      // Check if the value of the property contains the search term
                      if (
                        item[key] &&
                        typeof item[key] === "string" &&
                        item[key].toLowerCase().includes(e.target.value.toLowerCase())
                      ) {
                        return true; // If found, include in the results
                      }
                    }
                    return false; // If not found in any field, exclude from the results
                  });
                  setSearchedData(results)
                  setDisplaySearchData(true)

                }}
                fontWeight='500'
                placeholder="Search..." borderRadius="16px" />
            </InputGroup>
            <Button variant="brand">Advance Search</Button>
          </Flex>
        </GridItem>
        <GridItem colSpan={4} textAlign={"right"}>
          <Button onClick={() => handleClick()} leftIcon={<AddIcon />} variant="brand">Add</Button>
        </GridItem>
        {selectedValues.length > 0 && <DeleteIcon onClick={() => setDelete(true)} color={'red'} />}
      </Grid>
      {/* </Flex> */}
      {/* Delete model */}
      <Delete isOpen={deleteModel} onClose={setDelete} setSelectedValues={setSelectedValues} url='api/lead/deleteMany' data={selectedValues} method='many' />
      <Box overflowY={"auto"} className="table-fix-container">
        <Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
          <Thead >
            {headerGroups?.map((headerGroup, index) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers?.map((column, index) => (
                  <Th
                    {...column.getHeaderProps(column.isSortable !== false && column.getSortByToggleProps())}
                    pe="10px"
                    key={index}
                    borderColor={borderColor}
                  >
                    <Flex
                      align="center"
                      justifyContent={column.center ? "center" : "start"}
                      fontSize={{ sm: "14px", lg: "16px" }}
                      color=" secondaryGray.900"
                    >
                      <span style={{ textTransform: "capitalize", marginRight: "8px" }}>
                        {column.render("Header")}
                      </span>
                      {column.isSortable !== false && (
                        <span>
                          {column.isSorted ? (column.isSortedDesc ? <FaSortDown /> : <FaSortUp />) : <FaSort />}
                        </span>
                      )}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>

            {isLoding ?
              <Tr>
                <Td colSpan={columns?.length}>
                  <Flex justifyContent={'center'} alignItems={'center'} width="100%" color={textColor} fontSize="sm" fontWeight="700">
                    <Spinner />
                  </Flex>
                </Td>
              </Tr>
              : data?.length === 0 ? (
                <Tr>
                  <Td colSpan={columns.length}>
                    <Text textAlign={'center'} width="100%" color={textColor} fontSize="sm" fontWeight="700">
                      -- No Data Found --
                    </Text>
                  </Td>
                </Tr>
              ) : page?.map((row, i) => {
                prepareRow(row);
                return (
                  <Tr {...row?.getRowProps()} key={i}>
                    {row?.cells?.map((cell, index) => {
                      let data = "";
                      if (cell?.column.Header === "#") {
                        data = (
                          <Flex align="center">
                            <Checkbox colorScheme="brandScheme" value={selectedValues} isChecked={selectedValues.includes(cell?.value)} onChange={(event) => handleCheckboxChange(event, cell?.value)} me="10px" />
                            <Text color={textColor} fontSize="sm" fontWeight="500">
                              {cell?.row?.index + 1}
                            </Text>
                          </Flex>
                        );
                      } else if (cell?.column.Header === "Name") {
                        data = (
                          <Link to={user?.role !== 'admin' ? `/leadView/${cell?.row?.values._id}` : `/admin/leadView/${cell?.row?.values._id}`}>
                            <Text
                              me="10px"
                              sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}
                              color='brand.600'
                              fontSize="sm"
                              fontWeight="500"
                            >
                              {cell?.value}
                            </Text>
                          </Link>
                        );
                      } else if (cell?.column.Header === "Email") {
                        data = (
                          <Text
                            me="10px"
                            fontSize="sm"
                            fontWeight="500"
                            color='brand.600'
                            sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline', cursor: 'pointer' } }}
                            onClick={() => {
                              setAddEmailHistory(true)
                              setSelectedId(cell?.row?.values._id)
                            }
                            }
                          >
                            {cell?.value
                            }
                          </Text>
                        );
                      } else if (cell?.column.Header === "PhoneNumber") {
                        data = (
                          <Text
                            me="10px"
                            fontSize="sm"
                            fontWeight="500"
                            color='brand.600'
                            sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline', cursor: 'pointer' } }}
                            onClick={() => {
                              setAddPhoneCall(true)
                              setCallSelectedId(cell?.row?.values._id)
                            }
                            }
                          >
                            {cell?.value}
                          </Text>
                        );
                      } else if (cell?.column.Header === "Address") {
                        data = (
                          <Text color={textColor} fontSize="sm" fontWeight="500">
                            {cell?.value}
                          </Text>
                        );
                      } else if (cell?.column.Header === "Status") {
                        data = (
                          <Text color={"secondaryGray.900"} bgColor={cell?.value === "active" ? "green.500" : cell?.value === "sold" ? "red.300" : cell?.value === "pending" ? "yellow.400" : "#000"
                          } p={1} borderRadius={"20px"} textAlign={"center"} fontSize="sm" fontWeight="500" textTransform={"capitalize"}>
                            {cell?.value}
                          </Text>
                        );
                      } else if (cell?.column.Header === "Owner") {
                        data = (
                          <Text color={textColor} fontSize="sm" fontWeight="500">
                            {cell?.value}
                          </Text>
                        );
                      } else if (cell?.column.Header === "Score") {
                        data = (
                          <Text color={
                            cell?.value < 40
                              ? 'red.600'
                              : cell?.value < 80
                                ? 'yellow.400'
                                : 'green.600'
                          } fontSize="md" fontWeight="900" textAlign={"center"} >
                            {cell?.value}
                          </Text>
                        );
                      } else if (cell?.column.Header === "Action") {
                        data = (
                          <Text fontSize="md" fontWeight="900" textAlign={"center"} >
                            <Menu isLazy  >
                              <MenuButton><CiMenuKebab /></MenuButton>
                              <MenuList position={'absolute'} right={-5} pl={'0.5em'} minW={'fit-content'} >
                                <MenuItem pr={10} icon={<EditIcon fontSize={15} />}>Edit</MenuItem>
                                <MenuItem pr={10} icon={<DeleteIcon fontSize={15} />}>Delete</MenuItem>
                                <MenuItem color={'green'} pr={10} onClick={() => navigate(user?.role !== 'admin' ? `/leadView/${cell?.row?.original._id}` : `/admin/leadView/${cell?.row?.original._id}`)} icon={<ViewIcon fontSize={15} />}>View</MenuItem>
                              </MenuList>
                            </Menu>
                          </Text>
                        )
                      }
                      return (
                        <Td
                          {...cell?.getCellProps()}
                          key={index}
                          fontSize={{ sm: "14px" }}
                          minW={{ sm: "150px", md: "200px", lg: "auto" }}
                          borderColor="transparent"
                        >
                          {data}
                        </Td>
                      );
                    })}
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </Box>
      {data?.length > 5 && <Pagination gotoPage={gotoPage} gopageValue={gopageValue} setGopageValue={setGopageValue} pageCount={pageCount} canPreviousPage={canPreviousPage} previousPage={previousPage} canNextPage={canNextPage} pageOptions={pageOptions} setPageSize={setPageSize} nextPage={nextPage} pageSize={pageSize} pageIndex={pageIndex} />}

      <AddEmailHistory fetchData={fetchData} isOpen={addEmailHistory} onClose={setAddEmailHistory} data={data?.contact} lead='true' id={selectedId} />
      <AddPhoneCall fetchData={fetchData} isOpen={addPhoneCall} onClose={setAddPhoneCall} data={data?.contact} id={callSelectedId} lead='true' />

      <Add isOpen={isOpen} size={size} onClose={onClose} />
    </Card>
    </>

  );
}
