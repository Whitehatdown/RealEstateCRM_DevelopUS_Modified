import { AddIcon } from "@chakra-ui/icons";
import { Button, Grid, GridItem, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getApi } from 'services/api';
import CheckTable from './components/CheckTable';
// import Add from "./Add";


const Index = () => {
    const columns = [
        {
            Header: "#",
            accessor: "_id",
            isSortable: false,
            width: 10
        },
        { Header: 'sender Email', accessor: 'senderEmail' },
        { Header: "recipient", accessor: "recipient", },
        { Header: "create From", accessor: "createByName", },
        { Header: "timestamp", accessor: "timestamp", },
        { Header: "create at" },

    ];
    const { isOpen, onOpen, onClose } = useDisclosure()
    const size = "lg";

    const handleClick = () => {
        onOpen()
    }

    return (
        <div>
            <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={1}>
                <GridItem colStart={6} textAlign={"right"}>
                    {/* <Button onClick={() => handleClick()} leftIcon={<AddIcon />} variant="brand">Add</Button> */}
                </GridItem>
            </Grid>
            {/* <CheckTable columnsData={columns} tableData={data} /> */}
            <CheckTable isOpen={isOpen} columnsData={columns} />
            {/* Add Form */}
            {/* <Add isOpen={isOpen} size={size} onClose={onClose} /> */}
        </div>
    )
}

export default Index
