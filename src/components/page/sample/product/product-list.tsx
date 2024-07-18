import DefaultTable from "@/components/shared/ui/default-table";
import DefaultTableBtn from "@/components/shared/ui/default-table-btn";
import { Button, Dropdown, MenuProps, Popconfirm } from "antd";
import { ColumnsType } from "antd/es/table";
import { Download } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import numeral from "numeral";
import React, { useCallback, useMemo, useState } from "react";
import productData from "../../../../pages/api/sample/products/nail_shops.json";

const ProductList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const router = useRouter();

  const { searchType, searchText } = router.query;

  const filteredItems = useMemo(() => {
    return productData.filter((item) => {
      if (!searchType || !searchText) return true;
      if (searchType === "productName") {
        return item.title.includes(searchText);
      }
      if (searchType === "brandName") {
        if (typeof item.addresses === "string") {
          return item.addresses.includes(searchText);
        }
        return false;
      }
      return true;
    });
  }, [searchType, searchText]);

  const totalCount = filteredItems.length;

  const handleChangePage = useCallback(
    (pageNumber: number) => {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, page: pageNumber },
      });
    },
    [router]
  );

  const onSelectChange = useCallback((newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  }, []);

  const modifyDropdownItems: MenuProps["items"] = useMemo(
    () => [
      {
        key: "statusUpdate",
        label: <a onClick={() => console.log(selectedRowKeys)}>상태수정</a>,
      },
    ],
    [selectedRowKeys]
  );

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const columns: ColumnsType<any> = [
    {
      key: "action",
      width: 120,
      align: "center",
      render: (_value: unknown, record: any) => {
        return (
          <span className="flex justify-center gap-2">
            <Link href={`/sample/product/edit/${record.id}`} className="px-2 py-1 text-sm btn">
              수정
            </Link>
            <Popconfirm
              title="상품을 삭제하시겠습니까?"
              onConfirm={() => alert("삭제")}
              okText="예"
              cancelText="아니오"
            >
              <a className="px-2 py-1 text-sm btn">삭제</a>
            </Popconfirm>
          </span>
        );
      },
    },
    {
      title: "업체명",
      dataIndex: "title",
      width: 100,
    },
    {
      title: "업체주소",
      dataIndex: "addresses",
      width: 400,
      render: (addresses: string) => {
        return <div>{addresses}</div>;
      },
    },
    {
      title: "영업분류",
      dataIndex: "category",
      align: "center",
      width: 100,
    },
    {
      title: "방문자 리뷰수",
      dataIndex: "human_review",
      align: "center",
      width: 100,
      render: (value: number) => {
        return <p>{numeral(value).format("0,0")}건</p>;
      },
    },
    {
      title: "블로그 리뷰수",
      dataIndex: "blog_review",
      align: "center",
      width: 100,
      render: (value: number) => {
        return <p>{numeral(value).format("0,0")}건</p>;
      },
    },
    {
      title: "X좌표",
      dataIndex: "x",
      align: "center",
      width: 120,
    },
    {
      title: "Y좌표",
      dataIndex: "y",
      align: "center",
      width: 120,
    },
  ];

  return (
    <>
      <DefaultTableBtn className="justify-between">
        <div>
          <Dropdown disabled={!hasSelected} menu={{ items: modifyDropdownItems }} trigger={["click"]}>
            <Button>일괄수정</Button>
          </Dropdown>
          <span style={{ marginLeft: 8 }}>{hasSelected ? `${selectedRowKeys.length}건 선택` : ""}</span>
        </div>
        <div className="flex-item-list">
          <Button className="btn-with-icon" icon={<Download />}>
            엑셀 다운로드
          </Button>
          <Button type="primary" onClick={() => router.push("/sample/product/new")}>
            상품등록
          </Button>
        </div>
      </DefaultTableBtn>

      <DefaultTable<any>
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredItems}
        pagination={{
          current: Number(router.query.page || 1),
          defaultPageSize: 50,
          total: totalCount,
          showSizeChanger: false,
          onChange: handleChangePage,
        }}
        className="mt-3"
        countLabel={totalCount}
      />
    </>
  );
};

export default React.memo(ProductList);
